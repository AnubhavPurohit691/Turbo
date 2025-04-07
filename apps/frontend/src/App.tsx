import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './auth/Signup'
import ProtectedRoute from '../protection/Protection'
import Login from "./auth/Login"
import ErrorPage from './page/ErrorPage'
import Chat from './page/Chat'
import Chatbox from './page/Chatbox'

function App() {

  return (
    <>
        <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat/>
          </ProtectedRoute>
        } />
        <Route path="/chat/:roomid" element={
          <ProtectedRoute>
            <Chatbox/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<ErrorPage/>} />
        </Routes>
    </>
  )
}

export default App
