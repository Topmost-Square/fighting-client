import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import {Register} from "./pages/Register";
import {Login} from "./pages/Login";
import {Games} from "./pages/Games";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='register' element={ <Register />}/>
            <Route path='login' element={ <Login />}/>
            <Route path='/' element={ <Games />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
