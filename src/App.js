import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
                    <Routes>
                    <Route path="/splash" element={
                            <React.Fragment>
                                <Header />
                                <SplashPage setToken={setToken}/>
                            </React.Fragment>
                    }/>
                    <Route path="/register" element={
                            <React.Fragment>
                                <Header />
                                <Register />
                            </React.Fragment>
                    }/>
                    <Route path="/finances" element={
                            <FinancesSetup auth={token}/>
                    }/>
                    <Route path="/dashboard" element={
                            <React.Fragment>
                                <Dashboard auth={token} />
                                <MobileMenu />
                            </React.Fragment>
                    }/>
                    <Route path="/profile" element={
                            <React.Fragment>
                                <Profile auth={token} />
                                <MobileMenu/>
                            </React.Fragment>
                    }/>
                    </Routes>
                </BrowserRouter>
            </div>
          );
}

export default App;
