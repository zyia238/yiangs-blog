import BlogItem from "./BlogItem.component"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";

type Props = {
    BlogsData:Array<any>,
    isLoading:boolean
}

const BlogList = ({BlogsData,isLoading}: Props) => {

  return (
    <>
        <section className={`flex flex-col items-center content-cente `}>
            { (!isLoading) ? BlogsData ? BlogsData.map((blog) => {
                    return (<>
                    <BlogItem key={blog._id} {...blog}/>
                    <section>
                        <Stack spacing={2} className="flex content-center items-center w-full">
                            <Pagination count={BlogsData ? BlogsData.length : 1} />
                        </Stack>
                     </section></>)
                }) : <div>Some errors occurred</div> : 
                    <CircularProgress />
            }

        </section>
        
    </>
  )
}

export default BlogList