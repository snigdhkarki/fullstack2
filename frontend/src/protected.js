import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function Protected() {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  var check = true;
  const [userData, setUserData] = useState({email:''});

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
    socket.on('connect', () => {
      console.log('connected to server');
    });
    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });
    
    socket.on('previous messages', (msgs) => {
      setMessages(msgs);
    });
    
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);     
      if (check){     
      setMessages(prevMessages => [...prevMessages, msg]);
      check = false;
      }
      else{
        check =true;
      }
      
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    socket.emit('chat message', userData.email.split('@')[0]+':  '+ input);
    setInput('');
  };

  return (
    <div>
        <Navbar/>
      <div id="messages" style={{ border: '1px solid black', height: '300px', overflow: 'scroll', padding: '10px', width: '500px' }}>
        {messages.map((message, index) => 
            message.split(':')[0] === userData.email.split('@')[0] ? (<div key={index} style={{ color: 'red' }}>{message}</div>)
            :(<div key={index}>{message}</div>)
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input id="m" autoComplete="off" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}

export default Protected;
