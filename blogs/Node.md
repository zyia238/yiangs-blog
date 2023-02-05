---
title: 'Node.js notes'
image: '2.png'
excerpt: 'Node.js notes'
date: 2023/2/5
slug: 'Node'
---
# Node.js

## HTTP

当我们需要处理request body的时候，默认情况下在express中是读取不到的，需要在app中使用中间件

```js
// 加入下列代码后就可以通过request.body访问请求体中的内容了
// 这也被称为body-parser
app.use(express.json())
```

express中间件的概念全部是围绕request-response周期来进行的，简而言之就是对request和response的进行加工修改的functions，指代的是request进入服务器一直到服务器发出response前的过程，在express中几乎一切都是中间件，包括router，每一个中间件按照他们在js文件中定义的顺序对req,res进行加工，前一个中间件程序通过调用内置的next方法进行到下一个中间件，最后通过调用res.send方法结束这个中间件pipeline的周期从而结束整个过程

### 处理url中的参数

所有的动态路由中的变量都可以通过`/:id`形式进行定义，路由中所有的地址都会被存放在req.parms属性中

从params中提取中的值默认都是string形式，所以如果是id的话需要做一层转换

### 中间件

基本上所有的中间件都具有以下的形式，视频中距离了好用的logging日志打印第三方中间件morgan，

使用方式是调用morgan()，传入一个表示日志打印模式的字符串，而后该方法会返回一个如下形式的中间件function

```js
app.use((req,res,next)=>{
  next()
})
```

route handler 其实也是一种中间件，只不过这个中间件只针对特定的路由生效

### Mounting Router

在经过整理过后的路由代码长这个样子

```js
app.route('/api/v1/tours').get(getAllTours).post(createNewTour)
app.route('/api/v1/users').get(getAllUsers)
```

其实这里可以看出app充当了这些路由的router，如果我们想要更加规范的文件结构的话，我们可以根据业务的不同创建sub-app也就是子程序，这些子程序充当不同业务部分（在这个例子中是users和tours）的router，并且在app上挂在这个router

原先我们都是在app上挂载route，但其实更好的做法是针对每一个特定的url路径创建特定的路由

```js
const toursRouter = express.Router()
// 表示针对这一特定的url使用特定的中间件
app.use('/api/v1/tours',toursRouter)
```

首先需要将`server.js`独立出来，目前只需要包含除express以外的代码，即监听端口号的代码，这样server.js就还可以用来进行数据库、环境变量等的配置

其次有关express的代码还需要拆成`controller`文件夹以及`routes`文件夹，controller其实就相当于handler，针对每一个url所需要进行的特殊处理，只不过因为所需要用到的软件架构是MVC，C代表controller所以会这样起名字

### Param Middleware

在tours Controller文件中，我们在每一个Handler中都添加了判断id是否valid的逻辑，首先这使得了handler的关注点分离，使其不能focus on这些handler本身的目的，再者这违背了DRY，我们需要尽可能的利用express提供的middleware stack理念来管理我们的应用

```js
router.param('id',(req,res,next,val)=>{
  return res.send('only runs in the tourRouter')
})
```

### CommonJs导出

如果需要在一个模块中导出很多functions

```js
// foo.js
exports.foo = () => {}
// bar.js  
const {foo} = require('./foo')
```

如果一个模块里只有一个exports

```js
module.exports = foo
```

### Chainning multiple middleware functions

其实就是针对同一个路径下的不同handler，可以决定执行顺序

在middleware中我们可以通过token判断用户是否有权限进行操作

```js
const middleware1 = (req,res,next) => {
  if(!req.body.price){
    return res.status(400).json({
      status:'error',
      message:'missing params'
    })
  }else{
    next()
  }
}
// 把中间件按照顺序以此排列在最终需要执行的controller前
toursRouter.route('/').get(middleware1,getAllUsers)
```

### serving static files

说白了就是允许用户通过url访问存储在服务端文件系统中的文件，当然你没办法访问文件夹，只可以访问静态文件

```js
app.use(express.static(`${__dirname}/public`))
```

上述代码会将public文件夹内的资源当做静态资源暴露出来，且我们在浏览器url中访问的时候不需要加入`/public`路径，因为默认情况下就回去public文件夹中去找

### 环境变量

环境变量的使用和前端项目中环境变量几乎相同

引入dotenv包，然后在dotenv实例上调用config方法并传入.env文件所在的地址即可

```js
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
```

此时就可以在process.env中获取到config文件中的字段和值了

很多时候判断app运行在什么环境变量下的依据都是process.env.NODE_ENV

在package.json中设置另一条script，通过`cross-env NODE_ENV=production`可以对环境变量进行修改

## MongoDB

MongoDB初学者使用时需要下载mongoserver以及mongoshell，mongos负责在后台创建一个service即为数据库服务，会一直在后端运行，Mongoshell则提供了用户连接到mongoserver的功能

```mongo
use natours-test
```

该指令会在没有指定数据库的时候创建数据库，但是在有了该数据库的时候载入进该数据库

```mongo
show dbs
show collections
```

载入进数据库后就可以使用`db`指代当前载入进的数据库了

```mongo
db.tours.find()
```

该条指令会查询当前数据库下的tours集合下的所有条目

#### Create

```mongo
db.tours.insertMany([{name:"foo",price:497,rating:48},{name:"foo",price:497,rating:48},{name:"foo",price:497,rating:48}])
```

#### Read

```mongo
db.tours.find({name:"foo"})
db.tours.find({price : {&lt:500}})
```

- AND

  ```mongo
  db.tours.find({name:"foo",price:{&gt:500}})
  ```

- OR

  ```mongo
  db.tours.find({$or:[{difficulty:"hard"},{price:{&lt:500}}]})
  ```

#### Update

```mongo
db.tours.updateMany({ price : {$lt:500}},{$set:{price:2000}})
```

### Mongoose

连接数据库

```js
const mongoose = require('mongoose')

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connet(DB)
```

使用mongoose前我们需要创建document，document通过model作为蓝图创建，model通过schema来进行描述和校验

然后我们通过对由model创建出来的实例进行操作来进行服务器与数据库之间的通信

```js
const tourSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  price:{
    required:true,
    type:Number
  },
  rating:{
    default:4.5,
    type:Number
  }
})

const Tour = mongoose.model('Tour',tourSchema)

const tourDoc = new Tour({
  name:'The Forest Hiker',
  price:497,
  rating:4.5
})

tourDoc.save().then(doc=>{
  console.log('Saved',doc)
})
```

另一种往数据库里添加document的方式是直接在model上调用方法create，参数就是document对应字段以及对应值

```js
const Tour = require('./tourModel')

Tour.create(req.body)
```

create方法返回一个promise，里面回返回创建的doc对象

通常我们需要使用try catch对这些对数据库进行更改的操作进行错误处理

通过model对数据库进行查询

```js
// 查询全量
model.find()
// 根据id查询，
model.findById()
model.find({_id:req.params.id})
```

#### Update

patch方法只需传入需要更新的字段，而put则是将查询的结果完全替换为传入的对象

findByIdAndUpdate第三个参数为options

```js
Tour.findByIdAndUpdate(id,{ fieldToBePatched: newVal},{
  new:true,
  runValidators:true
})
```

#### Delete

使用findByIdAndDelete实现，通常情况下删除成功后我们不返回任何数据给客户端，但会将状态码更改为204

#### Model.insertMany

insertMany后可以跟一个doc数组

#### Model.deleteMany

如果不加filter条件则会直接清空一个collection中的所有entity

### process.argv

在cli输入指令的时候，所有由空格隔开的参数都会被收进argv这个数组中，我们只需要根据判断其中不同的指令，执行不同的方法就可以得到类似CLI程序的效果

```js
if(process.argv[2] === 'import'){
  insertData()
}else if(process.argv[2] === 'delete'){
  deleteData()
}
```

### Improve api abilities

所以跟在url中`?`后的参数都会被自动添加到req.query中，这是一个由key/val组成的对象，包含了所有在url中等号左右的键值对

因为这个req.query我们想直接放进find中当做查询的条件，但是里面可能携带有包括sort,pagination等功能的字段，所以我们需要遍历queryObj中的这些字段并且去除，而后放进find中

但其实放进find中后返回的其实还是一个query，所以我们才可以在这个query后面chain上很多查询条件比如where(),equals()等等

如果我们此时直接await这个query的结果的话后续我们是没有办法直接对结果进行排序或者分页的，所以此处我们通常只是创建query，后续再在这个query上chain另外的filter options.

```js
const query = Model.find(queryObj)

const result = await query.limit(5)
```

目前的url只能查指定的key或者val

但是如果你想要查询大于、等于这些值的话，我们可以对url进行一些改造

`/api/v1/tours/duration[gte]=5`

这样的url会被express.req对象解析为`{duration:{gte:5}}`

事实上这和我们可以放入find()中的filter对象非常类似，我们只需要通过正则将规则(如上是gte)更改为前面加$符号的形式即可

#### sorting

首先我们先确认req.query中是否包含sort字段

sort后跟的字段表示数据库需要根据这个字段进行升序或者降序排序

默认是升序，在字段名前加`-`表示降序，比如`Model.sort('-price')`表示根据price进行降序排序

如果我们还需要另外的参数来比较两个相同price的entity，则我们可以在sortBy后加入空格，然后再加入第二个参考字段名

`Model.sort('-price duration')`

#### select

select的用途是限制返回给客户端的字段

使用方法和sorting类似，传入一个由空格隔开的字符串表示要返回的字段有哪些，如果不想要哪些字段就在字段名称前加`-`号

#### skip & limit

Skip().limit()

skip表示要跳过多少docs，limit表示每一个页的doc个数

### pipeline aggregation

本质上还是一条query，只不过提供了一条聚合管道，将查询到的数据一个一个通过管道中的stage最后聚合成想要的结果数据

```js
Tour.aggregate([
  // 第一道stage，其实就相当于filter，$match的值就是filter option
  {
    $match: { price : {$gt : 450} }
  },
  // 第二道stage，$group这个怪异的写法就是pipeline aggregation 的operator
  {
    $group: {
      // 表示根据哪一个字段分组，注意这里需要选中的字段都用字符串表示，并以$ sign 开头
      // 表示所有数据根据difficulty字段分组
      _id:'$difficulty',
      // key值可以自定义命名，后面表示规则
      // 规则中表示求取组中所有ratings字段的平均值并赋值给avgRatings也就是key值的字段中
      avgRatings: { $avg : "$ratings"}
    } 
  },
  // 当document中有数组时，我们可以用$unwind stage将数组中的每一个item都化为一个doc实例
  {
   $unwind: '$startDates' 
  },
  // MongoDB中比较日期也非常的容易，直接比较即可
  {
    $match : {
      // 此时经过unwind，startDates字段已经变为了一个string
      // 以下表达式就表达在2021年里的docs
      startDates: {
        $gte: new Date('2021-01-01'),
        $lte: new Date('2021-12-31')
      }  
    }
  },
  {
    $group : {
      // 直接根据日期的月份进行分组，用到了mongodb的表达式
      _id: {$month : '$startDates'}
      tours: {
     	 $push : '$name'
   	  },
      // 表示每有一个doc通过这个pipeline，就累加1
    	toursNum: {
        $sum : 1
      }
    }
  },
  // +1表示升序，-1表示降序
  {
  	$sort : { toursNum : -1}
  }
])
```

### Skipped

Virtual properties

P102 ~ P105 doc/ query/aggregation middleware

### Built-in validator

为了遵守fat model - thin controller模式，能尽量写进model的逻辑就尽量写进model

```js
new mongoose.Schema({
  name:{
    type:String,
    minLength:[10, 'must greater than 10 chars']
  },
  difficulty:{
    type:String,
    enum: {
      values:['ez','md','hd'],
      message:"err msg"
    }
  },
  startsDate:{
    type:Date,
    min:[new Date(2021-01-01),'error message']
  }
})
```

#### customized validator

```js
new mongoose.Schema({
  priceDiscount:{
    type:Number,
		validate:{
      // 我们需要用到this来指向正在创建或者更新的doc
      // val的值就是我们创建或者更新doc时传入的值
      validator(val){
        // 返回true即为通过
        return val < this.price
      },
      //error message
      message:"error"
    }
  },
})
```

这里通常可以引入第三方sanitizor库

### Debugging

视频里介绍了google出品的ndb(node debugger)，会开启一个默认的chrome调试工具

基础的debug就是打断点breakpoints，然后按照step一行代码一行代码执行

### handle 404 pages

如果没有对无法访问的API route做处理，默认会返回一个html页面，这其实不是我们想要的

我们首先要找到我们的 app.js ， 因为那里存放着我们的express app的逻辑

我们在所有的route后添加一个catch，因为在req-res周期里，如果路由匹配到了对应的http method以及路径后，我们都通过controller返回了res并且结束了这个周期，所以任何没有被router捕捉到的请求都会走到我们的404 catch中

这里的all表示所有的methods

```js
app.all('*',(req,res,next)=>{
  res.json({
    msg:"404 error"
  })
})
```

通常情况下我们会设置一个统一处理exceptions的中间件，只要我们在这里设置了4个参数，那么express就会默认将此识别为error hanling middleware

```js
app.use((err,req,res,next)=>{
  // 此处将会读取Error类中你传入的string
  err.message
})
```

这里会接收到的Error都是通过其他hanler中的next函数传入的，比如我们访问了一个不存在的route

```js
app.all('*',(req,res,next)=>{
  next(new Error('500'))
})
```

此时express就会跳过所有的中间件直达错误处理的中间件

### error outside express

有些时候我们会遇到数据库连接失败的问题，解决的方式很简单，可以直接在mongoose.connection方法后的catch进行捕捉，但是如果你的app还涉及其他的异步连接功能，你可能需要写很多catch block

所以正确做法是我们建立一个sercurity net，捕捉所有可能发生在异步代码中的错误

```js
process.on('unhandledRejection',err=>{
  console.log(err.name,err.message)
  process.exit(1)
})
```

在server文件中加入这样一个handler就可以捕捉到所有有关被reject的promise的错误信息并处理了

process.exit(1)表示退出进程且含有错误，exit(0)表示没有错误，但这个方发是一种粗暴的强制退方法，正确的用法应该是在我们的app关闭后，也就是处理完未处理的信息后运行一个callback再退出进程

```js
const server = app.listen(3000)
process.on('unhandledRejection',err=>{
  console.log(err.name,err.message)
  server.close(()=>{
      process.exit(1)
  })
})

// 非promise错误
process.on('uncaughtException',err=>{
  proecss.exit(1)
})
```

### hash the password

永远不要在数据库中存储plain password

这里用到了bcrypt库，同样的遵循fat model，最好的改变password并且存储的方式是使用schema hooks

这个中间件的触发时间为服务器接收到request并且准备将数据存入数据库前的一瞬间

```js
userSchema.pre('save',async function(req,res,next){
  this.password = bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefiend
})
```

### Json web tokens JWT

所有的通信都必须在HTTPS状态下进行，否则无意义。client首先通过POST发送username以及password给server，server去数据库中找是否存在这一个user，如果是就返回一个JWT，此后client将JWT保存在localStorage或者cookie当中，每一次访问服务器受保护的资源时都携带上。

JWT可以被任何人decode，由三个部分组成header,payload以及signature，所以JWT中不要放任何敏感信息

signature则由三部分组成，payload,header中的信息以及只有server知道的sercret通过算法生成，如果client侧传过来的payload + header 配合上只有server知道的secret 生成的signature 和用户一侧传入的signature不相等，则无法验证

### Signup & Login

#### signup

request body 中包含注册用户时需要的字段信息，密码通过bscrypt中的hash方法加密并存储到数据库中，到时候在Login的时候通过bcrypt中的compare方法比较验证是否密码正确

在validate过所有字段的正确性后，通过jsonwebtoken库的sign方法，生成token并且返回给客户端

```js
exports.signup = catchAsync(async (req,res,next) => {
  const queryBody = {...req.body}
  // 第一个参数为可以被提取的信息
  queryBody.password = await bcrypt.sign({id:queryBody._id},process.env.SECRET,{expiresIn:'90d'})
  // 创建的用户
  const createdUser = await User.create({...queryBody})
})
```

#### login

login就是通过POST请求发送邮箱地址和密码这中credentials，服务器接收到请求后经历如下步骤进行验证，如果验证成功就返回一个JWT，验证的步骤在前端同样也要设置，但req走到服务器时还是需要继续验证

1. 检验是否缺少字段，比如密码、邮箱等
2. 使用传入的唯一key值在数据库中查询
3. 查询到目标用户后通过bscrypt.compare方法比较明文密码以及hash过后的密码

### Protect resources

在我们需要保护的路径下写入另一个中间件以验证用户的真实性

在登录过后的用户通常在request header中加入一个authorization字段，后面的值以`Bearer `开头并且放入issued token

1. 首先检查request的header中是否有authorization字段和值

2. verfication ，通过jwt的verify方法，将token以及只有服务器知晓的secret进行验证，如果decode出来的header和body都正常（没有被恶意代码或者第三方修改过）则表示验证通过

   ```js
   //正常情况下我们是通过传入回调函数的形式知晓decode过后的payload信息的，但是我们可以用promise的形式处理
   const {promisify} = require('util')
   
   const decodedData = await promisify(jwt.verify)(token,process.env.SECRET)
   ```

3. 查看user是否存在，有一些情况下jwt还未失效，但是user已经被注销了，如果这时候如果有人能拿到这个jwt并且验证则还是会通过，所以我们在验证完token后还需要检查user是否存在在数据库

4. 查看用户是否在JWT有效期内更改了密码，因为那样的话JWT应该失效而不是生效，实现方式是如果检测到用户有密码更改，就在model中新添加一个passwordLastChangedAt字段，然后通过这个字段的值与JWT payload中的issuetime做比较，如果passwordLastChangedAt的时间戳在issueTime之后，那么就使其失效。

验证完毕后通常都会在req上新建一个字段附上用户信息，因为用户信息可能要被其他的middleware consume

#### Authorization

有些操作不单单是用户登录以后就可以进行的，比如说`deleteTour`，我们首先需要用户登录，再者我们需要判断用户的权限是否支持他执行delete操作

```js
tourRouter.route('/:id').delete(protect,restrictTo('admin'),deleteTour)
```

protect为验证登录中间件，并且负责将用户信息挂在到request中以便接下来的中间件使用

restrictTo是一个接收role的普通函数，他返回一个中间件函数，中间件中需要判断user的信息中的role字段是否在我们传入的允许进行此操作的roles数组内，如果是，则表示可以继续进行操作，走next

还有我们需要更改user的model以支持形式为enum的role字段

### Forget password

通常情况下如果用户忘记密码了，都是通过输入自己的邮箱，然后点击邮箱中的链接进行密码修改，其实这其中还涉及到一个resetToken的概念，当我们通过url访问forget password页面，服务器会根据邮箱查询这个人，然后给他生成一个resetToken以及resetToken的有效期

node.js中可以通过内置的crypto库先随机生成一串字符串，然后通过加密算法对其进行加密并存储到数据库中，而这个resetToken只有用户本人可以访问，即登录邮箱后点击邮件访问

#### resetPassword

我们想要通过邮件的方式将我们生成的字符串token发送给客户端，这里需要借助nodemailer实现信息的发送

首先在util文件夹下创建sendmail方法，可以接收一个options参数，按照官网上node.js需要的配置首先创建transporter

这里基本上就是配置一个服务，通过这个服务来发邮件，里面有传统的gmail,hotmail等等，但通过那些服务来发邮件会有数量限制且会被标记为spam

```js
const sendMail = async options => {
  var transporter = nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port:2525,
    auth:{
      user:"user",
      pass:"pass"
    }
  })
}
```

第二部就是配置payload中的信息

sendMail方法被配置为可以接收options的方法，所以在这里我们指定用户的email，text中设置我们想要返回的reset链接即可，这时候我们同样需要在router端配置对应url的handler来处理token并且更新密码，reset链接最好发送一个patch请求，因为那样会更新我们的doc，token直接放在链接里传输就行，记得在router端配置一个param来接受

```js
const message = {
  from:"from@text.com",
  to:options.email,
  subject:"subject",
  text:options.text
}
```

第三部就是发送

```js
transporter.sendMail(message)
```

### User related bussiness

1. updateMe : 所以首先需要检验updateMe controller中有没有涉及密码修改的字段。再者也不能用户传什么字段我们就修改什么字段，比如用户不能直接修改他们的role，不然他们就可以轻易得将自己的权限更改为admin
2. deleteMe: 用户自行删除账户的选项并不是指将doc从database中删除，而是将账户的status转为不活跃状态，我们在进行delete操作的时候只是将active属性变为false即可，需要在model中指定active字段

### Security related issues

#### Cookie

Cookie 简单来说就是一小段服务器可以发给客户端的字符串，当客户端接收到cookie的时候通常就会由浏览器自动储存起来，后续每次针对这个发给你cookie的服务端发起请求时都会携带上这个字符串

token理应存放在httpOnly tag设置为true，且只允许在HTTPS连接下传输的cookie中

在express中写入cookie很简单，httpOnly的意思是只允许浏览器发送和存储，不允许修改

这样就可以减少XSS(cross-site-scripting)攻击，客户端中很容易被嵌入这种可运行的代码并且读取本地信息

```js
res.cookie('JWT',tokenSigned,{
  expires:new Date(Date.now() + process.env.time),
  // 仅在https连接下生效
  secure:true,
  httpOnly:true
})
```

#### Rate-Limiting

express中最常用的Limit中间件为express-rate-limit

本质上会检索统一IP向服务器发送的API请求，限制其数量，可以有效防止DOS

#### Security Headers

helmet是一个热门的中间件，它由数个小的中间件组成，仅仅需要调用helmet函数，然后使用app.use(helmet())即可

它会将数个用于提升浏览器安全的header加入到response header中

### Sanitize & xss-clean

