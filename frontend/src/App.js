import React ,{ useState, useEffect } from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import Protected from "./protected";
import SignupPage from "./SignupPage";


const App = () => {
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
  
  console.log(userData)
  if(userData !== ''){console.log('token')}else{console.log('no token')}
      if (userData === '') {
        return (
          <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
    </Routes>
    </BrowserRouter>

        )
      } else{
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Protected/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
    </Routes>
    </BrowserRouter>
  );}
};

export default App;