import React,{useContext} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../UserContext';
import { getToken, removeToken } from '../utils/helper';
import { Link } from 'react-router-dom';

export default function NavbarC() {
  const navigate = useNavigate();
  const { isLoggedIn ,setIsLoggedIn} = useContext(UserContext);

  const handleLogout = async () => {
    const authToken = getToken();
    
    try {
      
      await axios.post("http://localhost:4000/logout", null, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
      });
      
      console.log("Logout successful:");
      removeToken()
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
    
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Gallery App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
         
            {
             
                isLoggedIn ? (
                  <> 
                      <Link to="/fileupload" className="nav-link">FileUpload</Link>
                      <Link to="/gallery" className="nav-link">Gallery</Link>
                      <Nav.Link onClick={handleLogout}>SignOut</Nav.Link>
                  </>
                ):null
                
            }
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
