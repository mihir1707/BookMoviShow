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
import Layout from './pages/Admin/Layout.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import AddShows from './pages/Admin/AddShows.jsx'
import ListShows from './pages/Admin/ListShows.jsx'
import ListBookings from './pages/Admin/ListBookings.jsx'
import TheaterList from './pages/TheaterList.jsx'
import Login from "./pages/Login.jsx";
import Signup from './pages/Signup.jsx'
import Food from './pages/Food.jsx'
import Payment from './pages/Payment.jsx'

function App() {

  const location = useLocation();

  const hideNavbar = location.pathname.startsWith('/admin') 
  || location.pathname.includes('seat-layout')
  || location.pathname.includes('payment')

  return (
    <>
      <Toaster/>
      {!hideNavbar && <Navbar/>}
      {!hideNavbar && <Login/>}
      {!hideNavbar && <Signup/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/theater-list' element={<TheaterList/>} />
        <Route path='/movie/:id/:theaterName/seat-layout' element={<SeatLayout/>} />
        <Route path='/movie/:id/theater/food' element={<Food/>} />
        <Route path='/my-bookings' element={<MyBooking/>} />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/payment' element={<Payment/>} />
        <Route path='/admin/*' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-shows' element={<AddShows/>}/>
          <Route path='list-shows' element={<ListShows/>}/>
          <Route path='list-bookings' element={<ListBookings/>}/>
        </Route>
      </Routes>
      {!hideNavbar && <hr className='border-2'></hr>}
      {!hideNavbar && <Footer/>}
    </>
  )
}

export default App
