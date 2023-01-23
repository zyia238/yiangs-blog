import { FC } from "react"
import Link from "next/link"

interface NavItemProps {
    icon:JSX.Element,
    title:string
}

const NavItem : FC<NavItemProps> = ({icon,title}) => {
  return (
    <Link href={`${title.toLocaleLowerCase()}`}>
        <div className="flex items-center text-white cursor-pointer">
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