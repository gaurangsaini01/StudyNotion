import './App.css'
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './components/navabr/Navbar'

function App() {
 
  return (
    <>
      <div className='min-h-screen w-screen bg-richblack-900 flex flex-col font-inter'>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Home/> }/>
        {/* <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
      </div>
    </>
  )
}

export default App