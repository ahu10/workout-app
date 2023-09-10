import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function Login({ setToken }) {
  const navigate = useNavigate()
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((login) => ({ ...login, [name]: value }));
  }

  function signup () {
    navigate("/signup")
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    const person = { ...login };
  
    const response = await fetch("http://localhost:5050/record/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  
    try {
      if (response.status === 200) {
        const responseData = await response.json();
        const { token } = responseData;
  
        // Store the token securely (e.g., in localStorage)
        localStorage.setItem("token", token);
  
        //console.log("Token from server:", token);

        // Pass the token to the parent component (App.js)
        setToken(token);
  
        // Go back to root directory
        navigate("/");
      } else {
        setLogin({ username: "", password: "" });
      }
  
      //alert(response.statusText);
      //alert(response.status);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
        <form className="Login" onSubmit={handleSubmit}>
            <label>Email </label>
            <input 
                type="text"
                name="username"
                value={login.username}
                required
                onChange={handleChange} />
            
            <label>Password </label>
            <input 
                type="password"
                name="password"
                value={login.password}
                required
                onChange={handleChange} />
            
            <button type="submit" value="Submit">Submit</button>
        </form>
    {user && <navigate to="/dashboard" state={user} replace={true} />}
    <input type="button" value="Create new account" onClick= {signup} />
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}