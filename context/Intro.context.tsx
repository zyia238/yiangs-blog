import { ContentType } from '@/types/Intro.types'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

interface IntroContext {
    introData:ContentType[],
    setIntroData:Dispatch<SetStateAction<ContentType[]>>
}

export const IntroContext = createContext({
    introData:[],
    setIntroData:()=>{}
} as IntroContext)

type Props = {
    children:React.ReactNode
}

const IntroContextProvider = ({children}: Props) => {
  const [introData,setIntroData] = useState<Array<ContentType>>([])
  return (
    <IntroContext.Provider value={{introData,setIntroData}}>
        {children}
    </IntroContext.Provider>
  )
}

export default IntroContextProvider