import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import { authClient } from "./lib/auth-client.js"  

import { Home } from './pages/Home'
import { Navbar } from './components/Navbar'
import { Puzzle } from './pages/Puzzle'
import { SignIn } from './pages/Signin'
import { User } from './pages/User.jsx'
import { CollectionPuzzle } from './pages/CollectionPuzzle.jsx'
import { SignUp } from './pages/Signup.jsx'
import { NewCollection } from './pages/NewCollection.jsx'
import { Collection } from './pages/Collections.jsx'
import { Leaderboard } from './pages/Leaderboard.jsx'
import Footer from './components/Footer.jsx'


function App() {
    const [session, setSession] = useState()

    useEffect(()=>{
        const loadSession = async () => {
            const { data: session} = await authClient.getSession()
            setSession(session)
        }
        if(!session){
          loadSession()
        }

    }, [session])
  
  
  return (
    <>
      <div>
        <BrowserRouter>
        <Navbar session={session}/>
          <Routes>
            <Route path="/" element={<Home  session={session}/>}/>
            <Route path="/puzzle" element={<Puzzle/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route element={<ProtectedRoute session={session}/>}>
              <Route path="/user" element={<User session={session}/>}/>
              <Route path="/collection/:id" element={<CollectionPuzzle session={session}/>}/>
              <Route path="/collection/newcollection" element={<NewCollection/>}/>
              <Route path="/collection/collections" element={<Collection/>}/>
            </Route>
          </Routes>
        <Footer/>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
