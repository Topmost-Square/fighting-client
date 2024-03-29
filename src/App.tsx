import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Menu } from "./pages/Menu";
import {isAuth, useAuth} from "./utils/auth";
import { Practice } from "./pages/Practice";
import {SelectPracticeFighter} from "./pages/SelectPracticeFighter";
import {FightResult} from "./pages/FightResult";

const App = () => {
    useAuth();

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
              path='/select/practice'
              element={
                  <AuthRoute>
                      <SelectPracticeFighter />
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
          <Route
              path='/result'
              element={
                  <AuthRoute>
                      <FightResult />
                  </AuthRoute>
              }
          />
      </Routes>
  );
}

export default App;
