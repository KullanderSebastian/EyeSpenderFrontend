import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header";
import SplashPage from "./components/SplashPage";
import Dashboard from "./components/Dashboard";
import useToken from "./components/useToken";

function App() {
    const { token, setToken } = useToken();

    if (!token) {
        return (
            <div>
                <Header />
                <SplashPage setToken={setToken}/>
            </div>
        )
    }

    return (
        <div className="app">
            <Header />
            <BrowserRouter>
                <Switch>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
      );
}

export default App;
