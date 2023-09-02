import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault()
    alert(`${email}`)
  }

  return (
    <form className="Login" onSubmit={handleSubmit}>
        <label>Email </label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <label>Password </label>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <button type="submit" value="Submit">Submit</button>


    </form>
  );
}