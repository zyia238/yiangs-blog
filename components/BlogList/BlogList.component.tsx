import BlogItem from "./BlogItem.component";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

type Props = {
  BlogsData: Array<any>;
  isLoading: boolean;
};

const BlogList = ({ BlogsData, isLoading }: Props) => {
  return (
    <>
      <section className={`flex flex-col items-center content-cente w-full`}>
        {!isLoading ? (
          BlogsData ? (
            BlogsData.map((blog) => {
              return (
                  <BlogItem
                    key={blog._id ? blog._id : new Date().getTime().toString()}
                    {...blog}
                  />
              );
            })
          ) : (
            <div>Some errors occurred</div>
          )
        ) : (
          <CircularProgress />
        )}
      </section>
      <section className="mt-4">
        <Stack spacing={2} className="flex content-center items-center w-full">
          <Pagination count={BlogsData ? BlogsData.length : 1} />
        </Stack>
      </section>
    </>
  );
};

export default BlogList;
