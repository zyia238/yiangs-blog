import BlogItem from "./BlogItem.component"

type Props = {
    BlogsData:Array<any>
}

const BlogList = ({BlogsData}: Props) => {
  return (
    <>
        <section className="flex flex-col ">
            {
                BlogsData.map((blog,index) => <BlogItem key={index} {...blog}/>)
            }
        </section>
        <section>
            pagination
        </section>
    </>
  )
}

export default BlogList