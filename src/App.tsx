import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Menu } from "./pages/Menu";
import { isAuth } from "./utils/auth";
import { Practice } from "./pages/Practice";

const App = () => {
    const AuthRoute = ({ children }: any) => {
        if (isAuth()) {
            return children
        }
        return <Navigate to='/login' />
    }

    const UnAuthRoute = ({ children }: any) => {
        if (isAuth()) {
            return <Navigate to='/' />
        }
        return children
    }

  return (
      <Routes>
          <Route
              path='register'
              element={
              <UnAuthRoute>
                  <Register />
              </UnAuthRoute>
            }
          />
          <Route
              path='login'
              element={
              <UnAuthRoute>
                  <Login />
              </UnAuthRoute>
            }
          />
          <Route
              path='/'
              element={
                <AuthRoute>
                    <Menu />
                </AuthRoute>
              }
          />
          <Route
              path='/practice'
              element={
                  <AuthRoute>
                      <Practice />
                  </AuthRoute>
              }
          />
      </Routes>
  );
}

export default App;
