import React, { useState } from "react";

async function createUser(credentials) {
    return fetch("http://localhost:3001/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

function Register() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [usernameIsEntered, setUsernameBool] = useState(false);
    const [passwordIsEntered, setPasswordBool] = useState(false);
    let content;

    const handleSubmit = e => {
        e.preventDefault();

        createUser({
            "username": username,
            "password": password
        });
    }

    const handleButtons = e => {
        e.preventDefault();

        if (usernameIsEntered === false) {
            setUsernameBool(true);
            console.log("username is changed");
        } else if (passwordIsEntered === false) {
            setPasswordBool(true);
            console.log("password is changed");
        }
    }

    const back = e => {
        e.preventDefault();

        if (passwordIsEntered) {
            setPasswordBool(false);
        } else if (usernameIsEntered) {
            setUsernameBool(false);
        }
    }

    if (!usernameIsEntered) {
        content = <main className="registerForm">
                    <h2>Välj ett användarnamn</h2>
                    <p>Namnet du väljer är samma namn som du kommer att logga in med.</p>
                    <form>
                        <input
                            name="username"
                            key={1}
                            value={username ? username : ""}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="Användarnamn"
                        />
                        <button onClick={handleButtons}>Nästa</button>
                    </form>
                  </main>
    } else if (!passwordIsEntered) {
        content = <main className="registerForm">
                    <h2>Välj ditt lösenord</h2>
                    <p>Kom ihåg att spara lösenordet så att du inte glömmer bort det.</p>
                    <form>
                        <input
                            name="password"
                            type="password"
                            value={password ? password : ""}
                            key={2}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Lösenord"
                        />
                        <button onClick={handleButtons}>Nästa</button>
                        <a onClick={back}>Tillbaka</a>
                    </form>
                  </main>
    } else {
        content = <main className="registerForm">
                    <h2>Nästan där!</h2>
                    <p>Nu återstår bara att skapa kontot. Du kan gå tillbaka ifall du ångrar dig och vill ändra något.</p>
                    <form>
                        <button onClick={handleSubmit} className="createAccountBtn">Skapa konto</button>
                        <a onClick={back}>Tillbaka</a>
                    </form>
                  </main>
    }

    return (
        <div>{content}</div>
    )
}

export default Register;
