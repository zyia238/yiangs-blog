import { useContext, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { ContentType } from '@/types/Intro.types'
import { IntroContext } from '@/context/Intro.context'


type Props = {
  jsonData:Array<ContentType>
}

const index = ({jsonData}: Props) => {
  const {setIntroData} = useContext(IntroContext)
  useEffect(()=>{
    setIntroData(jsonData)
  },[jsonData])
  
  return (
    <div></div>
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