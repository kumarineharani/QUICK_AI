import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {

    const navigate = useNavigate()

  return (
    <div className='px-4 sm:px-20 xl:px-32 mt-20 sm:mt-32 relative inline-flex flex-col w-full justify-center 
    bg-[url(/gradientBackground.png)]  bg-cover bg-no-repeat min-h-screen '>

    <div className='text-center mb-6 '>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl
        font-semibold mx-auto leading-[1.2]'> 
            Create amazing content <br/>with <span className='text-primary'>AI tools</span>  </h1>
        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto
        max-sm:text-xs text-grey-600'> 
            Transfrom your content creation with our suite of premium AT tools,
            write article generate images  and enchance your creativity.
        </p>
    </div>


    <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
        <button onClick={()=> navigate('/ai') } className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102
         activate:scale-95 transition cursor-pointer'>
            Start creating now </button>
        <button className='bg-white px-10 py-3 rounded-lg border
        border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>
            Watch demo</button>  
    </div>
    <div className='flex items-center gap-4 mt-8 mx-auto text-grey-600'>
        <img src={assets.user_group} alt="" className='h-8' /> 
        Trusted by 10k+ users worldwide
    </div>
    </div>
  )
}

export default Hero

