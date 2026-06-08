import React from 'react'
import Navbar from './components/Navbar.jsx'
import {Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import SeatLayout from './pages/SeatLayout.jsx'
import MyBooking from './pages/MyBooking.jsx'
import Favorite from './pages/Favorite.jsx'
import Footer from './components/Footer.jsx'
import { Toaster } from 'react-hot-toast';
import TheaterList from './pages/TheaterList.jsx'
import Login from "./pages/Login.jsx";
import Signup from './pages/Signup.jsx'
import Payment from './pages/Payment.jsx'
import Releases from './pages/Releases.jsx'
import UpdateProfile from './pages/UpdateProfile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {

  const location = useLocation();

  const hideNavbar = location.pathname.includes('seat-layout')
  || location.pathname.includes('payment')
  || location.pathname === '/login' 
  || location.pathname === '/signup';

  const hideEffects = location.pathname.includes('seat-layout') 
  || location.pathname.includes('payment') 
  || location.pathname === '/login' 
  || location.pathname === '/signup';

  return (
    <>
      {/* {!hideEffects && <GlobalEffects />} */}
      <Toaster/>
      {!hideNavbar && <Navbar/>}
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/theater-list' element={<TheaterList/>} />
        <Route path='/releases' element={<Releases/>} />
        <Route path='/movie/:id/:theaterName/seat-layout' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={<MyBooking/>} />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/payment' element={<Payment/>} />
        <Route path='/profile' element={<UpdateProfile/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
      </Routes>
      {!hideNavbar && <hr className='border-2 mt-10'></hr>}
      {!hideNavbar && <Footer/>}
    </>
  )
}

export default App
