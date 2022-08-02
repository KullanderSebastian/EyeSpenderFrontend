import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styles/App.scss";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import SplashPage from "./components/SplashPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import FinancesSetup from "./components/FinancesSetup";
import Register from "./components/Register";
import useToken from "./components/useToken";

function App() {
    const { token, setToken } = useToken();
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        <Route path="/splash">
                            <Header />
                            <SplashPage setToken={setToken}/>
                        </Route>
                        <Route path="/register">
                            <Header />
                            <Register />
                        </Route>
                        <Route path="/finances">
                            <FinancesSetup auth={token} />
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard auth={token} />
                            <MobileMenu />
                        </Route>
                        <Route path="/profile">
                            <Profile auth={token}/>
                            <MobileMenu />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
          );
}

export default App;
