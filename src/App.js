import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styles/App.scss";
import Header from "./components/Header";
import SplashPage from "./components/SplashPage";
import Dashboard from "./components/Dashboard";
import FinancesSetup from "./components/FinancesSetup";
import Register from "./components/Register";
import useToken from "./components/useToken";

function App() {
    const { token, setToken } = useToken();

    if (!token) {
        return (
            <div>
                <Header />
                <BrowserRouter>
                    <Switch>
                        <Route path="/splash">
                            <SplashPage setToken={setToken}/>
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }

    return (
        <div className="app">
            <Header />
            <BrowserRouter>
                <Switch>
                    <Route path="/finances">
                        <FinancesSetup />
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
      );
}

export default App;
