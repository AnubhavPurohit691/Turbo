import './App.css'
import { Route, Routes } from 'react-router-dom'
import Signup from './auth/Signup'
import ProtectedRoute from '../protection/Protection'
import Login from "./auth/Login"
import ErrorPage from './page/ErrorPage'
import Chat from './page/Chat'

function App() {

  return (
    <>
        <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<ErrorPage/>} />
        </Routes>
    </>
  )
}

export default App
