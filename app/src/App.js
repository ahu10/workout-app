import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard.js';
import Preferences from './components/Preferences.js';
import Login from './components/Form.js';

/*const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);*/

function App() {
    return (
      <div className="wrapper">
        <h1>Application</h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
}

export default App;
