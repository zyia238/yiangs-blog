import { FC } from "react"
import Link from "next/link"

interface NavItemProps {
    icon:JSX.Element,
    title:string
}

const NavItem : FC<NavItemProps> = ({icon,title}) => {
  return (
    <Link href={`${title.toLocaleLowerCase()}`}>
        <div className="hover:bg-slate-100/20 ease-in duration-200 p-4 w-full h-12 relative flex items-center text-white cursor-pointer after:w-[1px] after:h-12 after:bg-[rgba(255,255,255,.18)] after:absolute after:right-0">
            <div className="text-lg mr-2">
                {icon}
            </div>
            <div className="text-lg">
                {title}
            </div>
        </div>
    </Link>
  )
}

export default NavItem