import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

async function loginUser(credentials) {
    return fetch("http://localhost:3001/users/login", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

async function getUserSetupStatus(username) {
    return fetch("http://localhost:3001/users/getusersetupstatus", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "username": username })
    })
    .then(data => data.json())
}

function SplashPage({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    let history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });

        sessionStorage.setItem("username", username);
        setToken(token.token);

        let status = await getUserSetupStatus(username);

        if (status.data === false) {
            history.push("/finances");
        } else {
            history.push("/dashboard");
        }
    }

    return (
        <main className="loginForm">
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Användarnamn"
                />
                <input
                    name="password"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Lösenord"
                />
            <button className="loginBtn">Logga in</button>
            </form>
            <hr></hr>
            <p>Har du inget konto?</p>
            <a href="register">
                <button className="createAccountBtn">Skapa konto</button>
            </a>
        </main>
    )
}

SplashPage.propTypes = {
  setToken: PropTypes.func.isRequired
};


export default SplashPage;
