import { FC , useEffect, useState} from "react"
import Link from "next/link"

import NavItem from "../NavBar/NavItem"

import { AiOutlineBulb, AiOutlineFile, AiOutlineHome, AiOutlineMessage , AiOutlineUser , AiOutlineBars} from "react-icons/ai";

interface NarvBarProps {
    children:React.ReactNode
}

const NavBar : FC<NarvBarProps> = ({children}) => {
  const [isHavingBg , setIsHavingBg] = useState<boolean>(false)
  const [isNavToggled , setIsNavToggled] = useState<boolean>(false)
  useEffect(()=>{
    const handler = ()=>{
        if(window.scrollY > window.outerHeight / 2){
            setIsHavingBg(true)
        }else{
            setIsHavingBg(false)
        }
    }
    window.addEventListener('scroll', handler)

    return () => {
        window.removeEventListener('scroll', handler)
    }

  },[])

  return (
    <>
        <header className={`z-40 max-sm:bg-black fixed top-0 left-0 flex justify-between w-full h-12 ${isHavingBg ? 'bg-black' : 'bg-transparent'} ease-in duration-300` }>
            <div className="flex items-center justify-between max-sm:w-full">
                <Link href="/">
                    <div className="text-[#48dbfb] text-lg px-4 whitespace-nowrap cursor-pointer">
                        Yiang Zhou's Blog
                    </div>
                </Link>
                <nav className="sm:flex hidden">
                    <NavItem icon={ <AiOutlineHome/> } title='Home'/>
                    <NavItem icon={ <AiOutlineBulb/>} title='Categories'/>
                    <NavItem icon={ <AiOutlineFile/>} title='Archives'/>
                    <NavItem icon={ <AiOutlineMessage/>} title='Activities'/>
                    <NavItem icon={ <AiOutlineUser/>} title='About'/>
                </nav>
                <div className="text-lg sm:hidden block text-white px-4 cursor-pointer" onClick={()=>{setIsNavToggled(!isNavToggled)}}>
                    <AiOutlineBars />
                </div>
                {isNavToggled && (<nav className="fixed top-12 bg-black w-full hidden space-y-4 pl-4 max-sm:flex flex-col pb-2 ease-in duration-300">
                    <NavItem icon={ <AiOutlineHome/> } title='Home'/>
                    <NavItem icon={ <AiOutlineBulb/>} title='Categories'/>
                    <NavItem icon={ <AiOutlineFile/>} title='Archives'/>
                    <NavItem icon={ <AiOutlineMessage/>} title='Activities'/>
                    <NavItem icon={ <AiOutlineUser/>} title='About'/>
                </nav>)}

            </div>
        </header>
        <main>
            {children}
        </main>
    </>
  )
}

export default NavBar