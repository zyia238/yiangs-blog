---
title: 'Next.js notes'
image: '1.jpg'
excerpt: 'Next.js notes'
date: 2023/1/22
slug: 'Next'

---
# Next.js

## File-path routing

### 获取url中的动态segment的值

```js
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
 	console.log(router.query)
}
```

### catch-all routes

不仅可以动态指定url中的某一个segement，还可以指定segments的数量

比如我们希望`blogs/2010/10`，这种blog后的segments全都可以被收集的情况下

在static file system中我们可以在blog文件夹后设置一个能够catch all routes的动态路由

文件夹名称为`[...date]`此时blogs后所有的路由都会渲染成该文件中的react组件，通过useRouter().query读取出来的url segments将变成一个数组，值依次为斜杠后的segments的值，上述url路径后就会返回

```js
{
  date:["2010","10"]
}
```

### 导航组件Link

在SPA中使用anchor标签会重新发送一条HTTP请求，这会导致已有的app中的状态重新刷新，所以需要和react-router-dom一样，引入Link标签

```jsx
// 注意此处就是默认导出Link，不需要加大括号
import Link from 'next/link'

<Link replace href='/portofolio'>Jump</Link>
```

### 命令式导航

```js
const router = useRouter()
router.push('/portfolio/1')
```

### 404.jsx

每当路由找不到对应需要显示的组件时，pages文件夹中的404.jsx就被显示

## Pre-rendering

有两种主流的预渲染方式：

- Static Generation: 项目在打包的时候页面就已经预渲染好了，在部署前就已经有页面已经被渲染好了，此时服务器或者CDN可以缓存这些已经生成的页面，这些页面被served的时候也会连带着react.js的逻辑，使得返回给客户端的页面是hydrated，即交互逻辑依然由react控制，但是html中已经包含了部分数据的app
- Server-side Rendering：只有当request到达服务器的时候，page才会准备好

Next.js默认pre-render所有没有动态数据的页面

### Static Generation

每一个在page中的组件文件中都可以导出一个next.js将会关注的函数，这个函数中的逻辑只会在部署该项目的电脑上（或服务器端）运行

```js
export async function getStaticProps(context){
  return {
    props:{
      products:[1,2,3,4,]
    }
  }
}
```

所有导出这个文件的组件就告诉了Next.js，这个页面需要被pre-render

这个函数的字面意思就是为了react组件准备其可以使用的props

几个需要注意的点：

```js
import {join} from 'path'
import {readFile} from 'fs/promises'

export async function getStaticProps(context){
  const pathname = join(process.cwd(),'data','data.json')
  const jsondata = await readFile(pathname)
  const data = JSON.parse(jsondata)
  return {
    props:data
  }
}
```

readFile从fs/promises导入的时候是文件读取的特殊版本，会返回一个promise

在从pages文件夹下的路由中获取root下的data文件夹中的data.json文件时，我们需要用join方法生成一个绝对路径，

process.cwd()方法会返回当前getStaticProps运行时的current working directory

next.js不会把当前函数运行的路径看做在pages下，而是把这个函数的运行路径当做是在root文件夹下

以上代码虽说是在服务器端运行的，但也不全是，这些代码是在部署这个服务的机器上运行的，故而称为Static Site Generation(SSG)

### Incremental Static Generation

有些时候我们需要pre-render数据需要频繁变化，有一个方式是我们就pre-render老数据，新的数据我们通过useEffect发送网络请求重新请求回来再更新我们的页面，这是一种方法，但是next.js还提供了另外一种方式：

对于服务器来说，我们可以针对每一次对于该页面进行的请求进行处理，至多X秒后这个页面将会被重新渲染并且cache进服务器/cdn中，下一次针对该页面的访问如果没有超过X秒则默认使用上一次缓存中的页面

如此功能只需要在getStaticProps函数return的对象中多加一个key

```js
export async function getStaticProps(context){
  return {
    props:...,
    // 单位为秒钟
    revalidate:10
  }
}
```

至此这个getStaticProps函数会在服务器端被调用(通过`npm start`在本地开启一个production mode server)，而不是像之前一样在构建过程中调用，这个pre-render过程会根据request进行自己调用，并更新在server中的缓存返回给请求该页面的客户端.

这个返回的对象中还可以添加其他的key，通常情况下在获取数据失败的情况下可能会用到：

```js
export async function getStaticProps(context){
  return {
    notFound:true,
    redirect:'/404'
  }
}
```

### getStaticProps中的context

比如说我们想要访问`product/1`且需要product1的数据被pre-render

我们需要通过context中的params属性读取这一部分动态的pid，然后取出pid并且在从fs中获取的data进行比对和筛选，筛出需要被pre-render的数据然后当做props传给component

这个逻辑是没有错的，但是这样做在next.js中会报错

```js
Server Error
getStaticPaths is required for dynamic SSG pages
```

上文曾经提及过，next.js会在默认情况下针对提供了getStaticProps的组件进行pre-render，但事实上并非如此

比如拥有动态路径的组件，这些组件理论上来说如果要进行pre-render，每一个不同数据的组件其实都应该是一个不同的HTML，next.js事先并不会知道有多少个html需要被pre-render，所以我们需要提供另一个async函数，也就是getStaticPaths来告知next.js

```js
export async getStaticPaths(){
  return {
    paths:[
      {params : {pid : "1"}}
    ],
    fallback:false
  }
}
```

只有规定了哪一些这个动态路径下的instances需要被pre-render，在getStaticProps中才可以从context中获取params

### next.js会pre-fetch一些页面上的数据

比如页面上有3个通向另外3个动态页面的链接，在我们进入这个页面的时候，浏览器就默认请求回了这三个链接页面里所需要的数据，这个功能是next.js直接提供的

### getStaticPaths中的fallback选项

如果像amazon那样有成千上万页面的网站，一个一个硬编码需要pre-render的页面就显得非常笨了，这些pre-render是在项目构建的时候生成的，且这样预渲染html页面会占用相当大的资源。

这个时候我们可以选择pre-render一些经常被访问的页面，且将fallback设置为true，这就告知了next.js，就算这些动态路由下的页面没有提供对应的params，页面仍然会被预渲染，只是只有每当request来到服务器请求这个页面时，才会刚好渲染。

这时候会有个问题，只有每当request来到服务器请求这个页面时，才会刚好渲染是一个过程，需要时间，我们直接通过url进行访问的时候可能预渲染过程还没好，这就导致组件中有些props属性并没有生成，这个时候我们就必须在组件中加入fallback组件，比如一个loading界面，等到预渲染过程结束后，就可以正常显示了。

不过这时候试想以下，如果我们把fallback设置为true，意为我们并不需要将所有可能需要pre-render的页面全部预先生成，而是等到有request请求到当前页面时再run一遍getStaticProps去取得静态的预渲染数据，这个时候我们访问一个不存在的页面，首先这时候一个查找过程，我们需要添加一个loading界面，再者getStaticProps中去搜寻这个id时并没有返回，所以等到查询结果后还是会报错，这个时候就非常适合将`{notFound:true}`从getStaticProps返回。

### server-side rendering

有些时候我们确实需要用的server-side rendering，比如我们需要拿到cookie，所以next.js提供了一个每当有request到达服务器后就会触发的函数getServerSideProps，这个函数也和getStaticProps一样需要被组件页面导出，只是不能和getServerSideProps一起用，他们的作用都是提供给组件可用的pre-render props

视频中提到的例子是有些页面我并不能预先生成，我们需要读取requst中的header或者cookie来确认发出请求的用户是否valid，否则每一个用户在访问这个用户界面的时候都可以直接拿到pre-render的页面，该函数返回的格式和getStaticProps一样

```js
export async function getServerSideProps(context){
  const { params, req, res} = context
  return {
    props:{
      user:'max'
    }
  }
}
```

通过getServerSideProps pre-render页面时并不能使用getStaicPaths来指定有哪些页面需要渲染，因为当request到达服务器端之前根本就不会有已经被渲染好的页面，所以next.js也根本不需要知道哪些页面是需要被预渲染的。

### Client's side data fetching

这就是正常情况下普通react.js项目中获取数据的主要方式，通常是在useEffect中通过浏览器内置的fetch方法对特定API进行数据获取

视频中提及了一个next.js提供给大家的hook，名字叫useSWR，使用方式和fetch类似，只不过多了一些缓存，还有页面聚焦时自动发送请求的功能

max使用了filebase中的realtime database作为dummy backend，然后通过GUI手动添加了几个需要返回的数据，我们在客户端代码中访问该API的时候需要在需要访问的table名称后面添加`.json`，这个是realtime database的规则

### Enhancement

现在回想一下，我们的网页没有标题，还缺少了很多meta元数据，这对SEO不友好

#### Head 组件

Next.js为开发者提供了一个可以嵌入在任何组件中修改html head标签中内容的组件，如下在Head组件中包裹的任何html内容都会被添加到html文件的head中

```jsx
import {Head} from 'next/head'

const Home = () => {
  return (
    {/* 注意可以嵌入在组件中的任何位置，不一定要在最外侧*/}
  	<div>
    	<Head>
      	<title>Hello world</title>
        <meta name="description" content="Hello world"/>
      </Head>
    </div>
  )
}
```

这个Head标签针对的是每一个不同的组件对应生成的html文件，所以很多情况下你需要在每一个组件中都使用Head，但是得益于Head可以之间写在jsx中，对于动态取值这种写法显得很便利

这时可能会有一种情况，就是一个组件如果采用了conditional render，那么只有其中一个condition中的jsx代码会被渲染，但是如果你只在主体的jsx中添加了Head标签，那么如果condition没有走到这个主体的jsx代码的话，这个显示出的html代码中就不会包含Head标签中你想要添加的head内容

其中一种解决方案是通过提取Head的公共部分并且存在一个变量中，然后在所有if check中使用并渲染这个变量

```jsx
const pageHeadData = <Head>
      	content
      </Head>
      
if(isloading){
  return (
  	{pageHeadData}
  )
}

else{
  return (
    {pageHeadData}
  )
}
```

### _app.js & _document.js

这两个文件在最新的next.js中并没有给出，但是我们可以通过修改这两个文件之中的结构给与整个App全局一定的影响

比如我们可以给全局app添加一个Head，或者在`-document.js`中添加一个在整个app组件树之外的html结构

### image optimization

全量获取的jpg文件会多达几个megabytes，这在生产环境下会造成不好的用户体验

通常情况下我们都会使用next.js提供的内置的已经帮开发者内置功能的Image组件来提供图片

```jsx
import Image from 'next/image'

const Home = () => {
  return (<>
          <Image src={'/pic'} alt="hello" width={160} height={160}/>
          </>)
}
```

Image组件中的width和height只的是我们最终fetch的图片的大小，图片真正的大小还是会受css样式影响

在使用了这个组件之后我们的图片大小会急剧缩小，且图片的格式也被替换为.webp格式的优化模式

同时next.js还会缓存这些已经生成好的文件，下一次有请求发来的时候就会直接替换上缓存文件

同时通过Image组件管理的图片会自动提供懒加载功能，只要页面上没有显示该图片，该图片就不会加载

## API Route

next.js不光可以做到通过file system来管理html路由，同样他还具备一些可以实现API路由的功能

在pages文件夹下新建一个必须的api文件夹，这个文件夹会被next.js特殊对待

api文件夹下可以根据业务需求创建任何对应route，比如创建了`api/feedback`，那么在客户端中访问这个url的路径就为`api/feedback`

```js
const handler = (req,res)=>{
  res.status(200).json({msg:'hello world'})
}
export default handler
```

直接通过前端代码直接和数据库进行通信是非常不安全的做法，因为这样会让你的数据库凭据暴露，但是如果我们通过api route接收一个api请求，再在服务端代码中与服务器进行通信就会安全

客户端请求数据的方式并没有什么特殊之处，需要注意的是通过POST HTTP方式发送的请求需要再fetch的配置中将内容放在body中并且使用JSON.stringfy进行处理

在api/feedback中，req中有两个重要的属性，一个为method用来判断对应的HTTP请求，另一个是`req.body`可以直接读取request body中传递过来的参数

handler如果不check http method，那么其将会响应所有的http method，包括但不限于get,post,put,delete

### 不要在getStaticProps或者getServerSideProps中使用fetch通信

我们需要知道的是在客户端代码中我们通过api与服务器进行通信，但是在静态生成代码的时候，我们确实只需要执行在api中真正涉及到业务的代码，直接在getStaticProps执行即可，在这里执行fetch是多余的

### Dynamic API Route

和HTML页面一样，我们也可以使用方括号括起来的js文件放置进API文件夹中充当动态的API Route

而后我们需要在handler的request中调用req.query去获取我们起名的占位符获取id并在数据库或者文件系统中进行查询和返回。

### Connecting to a real database

视频中使用了mongodb官方驱动在api routes中连接了mongodb

首先和mongoose不一样，我们先去npm下载mongodb 官方驱动

而后我们可以在api route中通过es module引入mongoClient

```js
import {MongoClient} from 'mongodb'

const handler = async (req,res)=> {
	const uri = '此处为mongodb atlas中点击connect to app后显示的url'
  const client = await MongoClient.connect(uri)
  // 因为uri中专门会有一个占位符让我们选择需要连接到的db，所以下面的db方法就不用指定数据库名称参数了
  const db = client.db()
 	db.collection('tableName').insertOne({email:"foo"})
	db.collection('tableName').find().sort({_id:-1}).toArray()
  client.close()
}
```

上述代码并没有做error handling，我们默认了连接到数据库以及数据库查询的过程都不会出错，这其实是不严谨的，我们需要使用上try-catch block并且返回500码以告知客户端连接出错，这样代码才不会crash