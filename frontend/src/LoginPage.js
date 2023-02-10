import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Protected from './protected';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailerror, setEmailerror] = useState('');
  const [passworderror, setPassworderror] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      email,
      password
    };
    console.log(data);
    fetch('http://localhost:9000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {  
             
        if (data.errors){
        
        setEmailerror(data.errors.email);
        setPassworderror(data.errors.password);  } 
        else{
          
          window.location.reload();
          
        }

      })
      .catch(error => { 
        console.log(error);       
        
      });
      
  };

  return (
    <div>
      { userData === '' ? (
  
  <>
    <Navbar/>
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <div className="email error">{ emailerror }</div>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <div className="password error">{ passworderror }</div>
      <button type="submit">Login</button>
    </form>
    </>) : (<Protected/>)}</div>
  );
}

export default Login;
