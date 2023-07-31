import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import React, { Suspense } from "react";

// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/Components/Navigation/MainNavigation";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Login from "./authentication/pages/Login";
// import Register from "./authentication/pages/Register";
import { AuthContext } from "./shared/context/auth-context";
import { useState, useCallback, useEffect } from "react";
import { isJwtExpired } from "jwt-check-expiration";
import LoadingSpinner from "./shared/Components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Login = React.lazy(() => import("./authentication/pages/Login"));
const Register = React.lazy(() => import("./authentication/pages/Register"));

function App() {
  const [token, setToken] = useState<any>(false);
  const [userId, setUserId] = useState<any>(false);

  const login = useCallback((uid: any, token: any) => {
    setToken(token);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token })
    ),
      setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") as string);
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  useEffect(() => {
    // console.log(isJwtExpired(token));
    if (token) {
      console.log("JWT Expired : " + isJwtExpired(token));
      if (isJwtExpired(token)) {
        console.log("In if block JWT Expired : " + isJwtExpired(token));
        logout();
      }
    }
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation></MainNavigation>
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner></LoadingSpinner>
              </div>
            }
          >
            <Switch>
              <Route path="/" exact>
                <Users></Users>
              </Route>
              <Route path="/places/new" exact>
                <NewPlace></NewPlace>
              </Route>
              <Route path="/:userId/places" exact>
                <UserPlaces></UserPlaces>
              </Route>
              <Route path="/places/:placeId" exact>
                <UpdatePlace></UpdatePlace>
              </Route>
              <Route path="/login" exact>
                <Login></Login>
              </Route>
              <Route path="/register" exact>
                <Register></Register>
              </Route>
              <Redirect to="/"></Redirect>
            </Switch>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
