import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    function checkUser() {
      fetch('http://localhost:9000/checkUser',{
        method: 'GET',
        header:{
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {         
        setUserData(data.user);
      })
      .catch(error => {
        console.error(error);
      });
    }
  
    checkUser();
  }, []);

  function Logout(){    
    fetch('http://localhost:9000/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(data => {        
      console.log(data); 
      window.location.reload()             
    })

  }

  return (
    <div>
      { userData !== '' ? (
        <div>
        <button onClick={Logout}>Log out</button>
      </div>
        
      ) : (
        <div>
          <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
        </div>
        
      )}
      
      
      
      

    </div>

  );
};

export default Navbar;