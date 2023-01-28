import { FC , useEffect, useState} from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

import NavItem from "../NavBar/NavItem"

import { AiOutlineBulb, AiOutlineFile, AiOutlineHome, AiOutlineMessage , AiOutlineUser , AiOutlineBars} from "react-icons/ai";
import { useRouter } from "next/router";

interface NarvBarProps {
}

const NavBar : FC<NarvBarProps> = () => {
  const [isHavingBg , setIsHavingBg] = useState<boolean>(false)
  const [isNavToggled , setIsNavToggled] = useState<boolean>(false)
  const router =  useRouter()
  useEffect(()=>{
    const handler = ()=>{
        if(window.scrollY > window.outerHeight / 2 && router.pathname === '/'){
            setIsHavingBg(true)
        }else if(window.scrollY < window.outerHeight / 2 && router.pathname === '/'){
            setIsHavingBg(false)
        }else if(router.pathname !== '/'){
            setIsHavingBg(true)
        }
    }
    window.addEventListener('scroll', handler)

    return () => {
        window.removeEventListener('scroll', handler)
    }
  },[router])

  return (
    <>
        <header className={`z-40 max-sm:bg-black fixed top-0 left-0 flex justify-between w-full h-12 ${isHavingBg ? 'bg-black' : 'bg-transparent'} ease-in duration-300` }>
            <div className="flex items-center justify-between max-sm:w-full">
                <Link href="/">
                    <div className="text-[#48dbfb] text-lg px-4 whitespace-nowrap cursor-pointer">
                        Yiang Zhou&nbsp;s Blog
                    </div>
                </Link>
                <nav className="sm:flex hidden">
                    <NavItem icon={ <AiOutlineBulb/>} title='Categories'/>
                    <NavItem icon={ <AiOutlineFile/>} title='Archives'/>
                    <NavItem icon={ <AiOutlineMessage/>} title='Activities'/>
                    <NavItem icon={ <AiOutlineUser/>} title='About'/>
                </nav>
                <div className="text-lg sm:hidden block text-white px-4 cursor-pointer" onClick={()=>{setIsNavToggled(!isNavToggled)}}>
                    <AiOutlineBars />
                </div>
                <div className="text-lg block text-white px-4 cursor-pointer" onClick={()=>{signIn('credentials', { redirect: false, name: 'test' , email:'test@test.com'})}}>
                    Sign in
                </div>
                {isNavToggled && (<nav className="fixed top-12 bg-black w-full hidden space-y-4 pl-4 max-sm:flex flex-col pb-2 ease-in duration-300">
                    <NavItem icon={ <AiOutlineBulb/>} title='Categories'/>
                    <NavItem icon={ <AiOutlineFile/>} title='Archives'/>
                    <NavItem icon={ <AiOutlineMessage/>} title='Activities'/>
                    <NavItem icon={ <AiOutlineUser/>} title='About'/>
                </nav>)}
                
            </div>
        </header>
    </>
  )
}

export default NavBar