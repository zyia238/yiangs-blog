import matter from "gray-matter";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import Tag from "./Tag.components";

type Props = {
  content: string;
  _id: string;
  isShowingDetail: boolean;
};

interface MetaType {
  [key: string]: any;
}

const BlogItem = ({ content, _id, isShowingDetail }: Props) => {
  const [meta, setMeta] = useState<MetaType>({});
  const [mdContent, setMdContent] = useState("");
  useEffect(() => {
    const { data, content: md } = matter(content);
    setMeta(data);
    setMdContent(md);
  }, [content]);

  const router = useRouter();

  const handleBlogItemClicked = () => {
    router.push(`/blogs/${_id}`);
  };

  return (
    <article className="m-box p-4 shadow-xl w-full relative">
      <h2
        className="text-2xl cursor-pointer hover:text-3xl transition-all duration-75 h-6 text-center flex justify-center"
        onClick={handleBlogItemClicked}
      >
        {meta.title}
      </h2>
      <div className="mt-4 flex justify-center gap-4 mb-4">
        <span className="text-[#48dbfb] flex justify-center items-center">
          <AiOutlineCalendar className="text-[#48dbfb] mr-1" />
          {meta.date}
        </span>
        <span className="flex justify-center items-center">
          <BsPencil className="mr-1" />
          Length≈{mdContent.length}words
        </span>
        <span className="flex justify-center items-center">
          <AiOutlineClockCircle className="mr-1" />
          Read time≈{Math.ceil(mdContent.length / 800)}min
        </span>
      </div>
      <div className="absolute -left-3 top-16 mb-4 p-4 h-4 bg-[#e16c2b] z-40 text-white flex justify-center items-center after:border-8 after:border-transparent after:border-b-[#e16c2b] after:w-0 after:h-0 after:rotate-45 after:absolute after:top-6 after:left-1 after:-z-40">
        notes taken
      </div>
      <p>{meta.description}</p>
      {
        router.pathname === '/'  && (<div className="flex justify-center">
        <Image
          src={`/images/${meta.image}`}
          alt="thumbnails"
          width={400}
          height={200}
          className="w-3/4"
        />
        </div>)
      }
      {isShowingDetail && (
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, style, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={dark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {mdContent}
        </ReactMarkdown>
      )}
      {router.pathname === '/'  && <div className="flex justify-center">
        <button className="mt-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 h-8 rounded-[50px]" onClick={handleBlogItemClicked}>
          <span className="text-white">Read All</span>
        </button>
      </div>}
      
      <div className="w-full flex justify-center">
        <div className="border-t-[#dededf] border-t-[1px] w-[95%] mt-4 flex pt-4">
          <Tag tagname="Frontend"/>
        </div>
      </div>
    </article>
  );
};

export default BlogItem;
