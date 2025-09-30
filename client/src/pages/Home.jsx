import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import AiTools from '../components/AiTools.jsx'
import Testimonial from '../components/Testimonial.jsx'
import Plan from '../components/Plan.jsx'
import Footer from '../components/Footer.jsx'
const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <AiTools/>
      <Testimonial/>
      <Plan/>
      <Footer/>
    </>
  )
}

export default Home