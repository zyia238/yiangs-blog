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
  const {blogId} = router.query
  console.log(blogId,'blogId')
  
  useEffect(()=>{
    if(blogId){
      fetch(`/api/blogs/${blogId}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res=>{
        return res.json()
      }).then(data => {
        setBlogItemData(data.result)
      })
    }
  },[])
  return (
    <BlogItem {...blogItemData} isShowingDetail={true}/>
  )
}

export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default BlogDetailPage