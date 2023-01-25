import BlogItem from "@/components/BlogList/BlogItem.component"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

type Props = {
  content:string,
  _id:string
}

const BlogDetailPage = (props: Props) => {
  const [blogItemData , setBlogItemData] = useState<{ content:string, _id:string, isShowingDetail:boolean }>({
    content:"",
    _id:"",
    isShowingDetail:true
  })
  const router = useRouter()
  
  useEffect(()=>{
    const {blogId} = router.query  
    fetch(`/api/blogs/${blogId}`,{
      method:'POST',
      body:JSON.stringify({_id:blogId}),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>{
      return res.json()
    }).then(data => {
      setBlogItemData(data.result)
    })
  },[])
  return (
    <BlogItem {...blogItemData} isShowingDetail={true}/>
  )
}

export default BlogDetailPage