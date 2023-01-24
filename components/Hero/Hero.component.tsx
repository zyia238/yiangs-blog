import { useState , useEffect , useRef  } from 'react'
import Image from 'next/image'
import {BsArrowDownCircle} from "react-icons/bs";

import DancingTitle from './DancingTitle.component'


const Home = () => {
    const [percentage, setPercentage] = useState(0.5)
    const [hero,setHero] = useState<HTMLDivElement | null>(null)
    const heroContainer = useRef<HTMLDivElement>(null)
    const percentageContainer = useRef<string>("--percentage")


    useEffect(()=>{
        let { current } = heroContainer
        let startingPoint:number

        if(current){
            setHero(current)
            current.addEventListener('mouseenter',(e)=>{
            startingPoint = e.clientX
            const mouseMoveHandler = (e:MouseEvent)=>{
                let percentage = (e.clientX - startingPoint) / document.body.clientWidth  + .5
                setPercentage(percentage)
            }
            if(current){
                current.addEventListener('mousemove',mouseMoveHandler)
            }
            
            if(current){
                current.addEventListener('mouseleave',()=>{
                    setPercentage(0.5)
                    if(current){
                        current.removeEventListener('mousemove',mouseMoveHandler)
                    }
                })
            }
            
        })
        }
           
    },[])

    const handleShowMore = () => {
        window.scrollTo({
            top:hero!.clientHeight,
            behavior:'smooth'
        })
    }

    const ImageClassNames = `w-[110vw] h-[100vh] absolute`

    return (
        <>
            <section 
                style={{
                    [percentageContainer.current]:percentage,
                    width:'110vw',
                    height:'100vh',
                    position:'absolute',
                    transition:'all .2s ease'
                }}
                className="max-sm:hidden"
                ref={heroContainer}
            >
                <Image alt="bg-1" src={require('@/assets/background1.jpg')} className={ImageClassNames} style={{
                    opacity: `calc(1 - (${percentage} - 0.5) / 0.5)`,
                    transform:`translateX(${percentage * 20 - 50}px)`,
                }}/>
                <Image alt="bg-2" src={require('@/assets/background2.png')} className={ImageClassNames} style={{
                    opacity: `calc(1 - (${percentage} - 0.25) / 0.25)`,
                    transform:`translateX(${percentage * 20 - 50}px)`,
                }}/>
                <Image alt="bg-3" src={require('@/assets/background3.jpeg')} className={ImageClassNames} style={{
                        zIndex: '-1',
                        transform:`translateX(${percentage * 20 - 50}px)`,
                    }}
                />
                <DancingTitle />
                <div className='showMore'>
                    <BsArrowDownCircle onClick={handleShowMore} className="arrowIcon"/>
                </div>
                <Image src={require('@/assets/wave1.webp')} alt="wave-1" className='wave' width={600} />
                <Image src={require('@/assets/wave2.webp')} alt="wave-2" className='wave' width={600}  priority/>
            </section>
        </>
    )
}

export default Home