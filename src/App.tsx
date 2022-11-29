import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import {Register} from "./pages/Register";
import {Login} from "./pages/Login";
import {Menu} from "./pages/Menu";
import {isAuth} from "./utils/auth";

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

const App = () => {

  return (
          <BrowserRouter>
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
              </Routes>
          </BrowserRouter>
  );
}

export default App;
