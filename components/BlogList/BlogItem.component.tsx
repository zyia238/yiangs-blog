import matter from 'gray-matter'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Image from 'next/image';
import { useRouter } from 'next/router';

type Props = {
    content:string,
    _id:string,
    isShowingDetail:boolean
}

interface MetaType{
    [key: string]: any;
}

const BlogItem = ({content,_id,isShowingDetail}: Props) => {
  const [meta ,setMeta] = useState<MetaType>({})
  const [mdContent , setMdContent] = useState('')
  useEffect(()=>{
    const {data, content:md} = matter(content)
    setMeta(data)
    setMdContent(md)
  },[content])

  const router = useRouter()

  const handleBlogItemClicked = () => {
    router.push(`/blogs/${_id}`)
  }

  return (<article className='m-box p-4 shadow-xl' onClick={handleBlogItemClicked}>
        <h2>{meta.title}</h2>
        <div>
            <span>{meta.date}</span>
        </div>
        <p>
          {meta.description}
        </p>
        <Image src={`/images/${meta.image}`} alt="thumbnails" width={400} height={200}/>
        { isShowingDetail && <ReactMarkdown 
         components={{
          code({node, inline, className, children, style, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                
                style={dark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
        >{mdContent}</ReactMarkdown>
      }
    </article>
  )
}

export default BlogItem