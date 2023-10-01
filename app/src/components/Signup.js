import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate()
  const [login, setLogin] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((login) => ({ ...login, [name]: value }));
  }

  function loginPage() {
    navigate("/")
  }

  async function handleSubmit(event) {
    event.preventDefault()
    //alert(`${email}`)

    const person = {...login}
    if(person.password !== person.confirm) {
        alert("Passwords do not match")
        setLogin({...login, password: "", confirm: ""})
    }
    else {
        const response = await fetch("http://localhost:5050/record/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person)
        });

        if (response.status === 200) {
            alert("User created successfully. Please login")
            navigate("/")
        }
        else {
            alert(response.statusText)
            alert(response.status)
        }
    }   
  }

  return (
    <div id="container">
      <div id="form-box">
        <form className="Login" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email </label>
            <input 
                type="text"
                name="username"
                value={login.username}
                required
                onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Password </label>
            <input 
                type="password"
                name="password"
                value={login.password}
                required
                onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Confirm Password </label>
            <input 
                type="password"
                name="confirm"
                value={login.confirm}
                required
                onChange={handleChange} />
          </div>
            <button class="login-button" type="submit" value="Submit">Submit</button>
        </form>
        <input class="html-button" type="button" value="Login Page" onClick={loginPage}/>
      </div>
    </div>
  );
}