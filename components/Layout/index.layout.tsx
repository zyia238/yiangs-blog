import Hero from "@/components/Hero/Hero.component"
import { useRouter } from "next/router"
import NavBar from "./NavBar.component"
import Intro from "./Intro.component"
import Aside from "./Aside.component"

type Props = {
    children:React.ReactNode
}

const Layout = ({children}: Props) => {
  const router = useRouter()
  
  return (
    <div>
        <NavBar />
        <section className="h-[100vh] w-full">
          {router.pathname === '/' ? <Hero /> : null}
        </section>
        <main className={`flex my-4 mx-auto items-start w-[1400px]`}>
            <Intro/>
              <section className="w-[62.5%] my-0 mx-4">
                {children}
              </section>
            <Aside/>
        </main>
    </div>
  )
}

export default Layout