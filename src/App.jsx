import { Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import { useState } from 'react'
import './App.css'

//pages
import Home from './pages/Home.jsx';
import Countries from './pages/Countries.jsx';
import CountryDetails from './pages/CountryDetails.jsx';
import Collection from './pages/Collection.jsx';
import Quiz from './pages/Quiz.jsx';
import Leaderboard from './pages/Leaderboard';


function App() {

//with Layout as parent Route: now every route inside the parent 
// <Route element={<Layout/>}> will show the same header/nav, and the page content will render in <Outlet />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />}></Route>
        <Route path='/countries' element={<Countries />}></Route>
        <Route path='/countries/:countryCode' element={<CountryDetails />}></Route>
        <Route path='/collection' element={<Collection />}></Route>
        <Route path='/quiz' element={<Quiz />}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
      </Route>

      {/*404*/}
      <Route path='*' element={<h2>Page not found</h2>}></Route>
    </Routes>
  );
}

export default App
