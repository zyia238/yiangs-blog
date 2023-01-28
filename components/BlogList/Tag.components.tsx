import React from 'react'

type Props = {
    tagname:string
}

const Tag = ({tagname}: Props) => {
  return (
    <div className='bg-[#522bb4] px-4 relative text-white after:absolute after:-left-2 after:top-1 after:rotate-45 after:w-4 after:h-4 after:bg-inherit'>
        <div className='bg-white rounded w-1 h-1 absolute left-1 top-[50%] translate-y-[-50%] z-10'></div>
        {tagname}
    </div>
  )
}

export default Tag