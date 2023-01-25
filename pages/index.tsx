import { useContext, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { ContentType } from '@/types/Intro.types'
import { IntroContext } from '@/context/Intro.context'
import BlogList from '@/components/BlogList/BlogList.component'


type Props = {
  jsonData:Array<ContentType>
}

const index = ({jsonData}: Props) => {
  const [blogs , setBlogs] = useState([])
  const {setIntroData} = useContext(IntroContext)
  const [isLoading,setIsLoading] = useState(true)

  useEffect(()=>{
    setIntroData(jsonData)
  },[jsonData])

  useEffect(()=>{
    setIsLoading(true)
    try{
      fetch('/api/blogs',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res => {
        return res.json()
      }).then(data => {
        setBlogs(data.result)
        setIsLoading(false)
      })
    }catch{
      setIsLoading(false)
    }
  },[])
  
  return (
    <>
      <BlogList BlogsData={blogs} isLoading={isLoading}/>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const filePath = join(process.cwd(),'localData','IntroData.json')
  const fileData = await readFile(filePath,'utf-8')
  const jsonData = JSON.parse(fileData)
  
  return {
      props:{
          jsonData
      }
  }
}

export default index