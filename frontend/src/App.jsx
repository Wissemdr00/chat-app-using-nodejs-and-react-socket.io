import { Routes,Route,Navigate } from 'react-router-dom'
import './App.css'
import Chat from './pages/Chat'
import Login from './pages/login';
import Register from './pages/Register';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';

function App() {
  return(
    <>
        <NavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="*" element={<Navigate to={"/"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>  
        </Container>
    </>
  )  
}

export default App
