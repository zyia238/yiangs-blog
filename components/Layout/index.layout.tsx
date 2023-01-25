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
        {router.pathname === '/' ? 
          <section className="h-[100vh] w-full">
            <Hero /> 
          </section>
        : null}
        <main className={`flex ${router.pathname === '/' ? 'my-4' : 'my-16'} mx-auto items-start w-[1400px]`}>
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