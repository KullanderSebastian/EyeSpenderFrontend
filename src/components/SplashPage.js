import React, { useState } from "react";
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

function SplashPage({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });

        setToken(token.token);
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
                <hr></hr>
                <p>Har du inget konto?</p>
                <button className="createAccountBtn">Skapa konto</button>
            </form>
        </main>
    )
}

SplashPage.propTypes = {
  setToken: PropTypes.func.isRequired
};


export default SplashPage;
