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
    const [registerError, setRegisterError] = useState({
        error: null,
        status: null
    });
    let content;

    const handleSubmit = async e => {
        e.preventDefault();

        const res = await createUser({
            "username": username,
            "password": password
        });

        console.log(res.error);

        if (!res.error) {
            setRegisterError({
                error: false
            });
        } else if (res.error) {
            if (res.status === 400) {
                setRegisterError({
                    error: true,
                    status: 400
                });
            } else if (res.status === 500) {
                setRegisterError({
                    error: true,
                    status: 500
                });
            }
        }
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
    } if (registerError.error === false) {
        content = <main className="registerForm">
                    <h2>Ditt konto är skapat!</h2>
                    <p>Du kan nu testa att </p><a href="splash">logga in.</a>
                  </main>
    } else if (registerError.error === true) {
        if (registerError.status === 400) {
            content = <main className="registerForm">
                        <h2>Användarnamnet du angav används redan av ett annat konto!</h2>
                        <p>Vänligen gå <a href="/register">tillbaka</a> och välj ett nytt namn.</p>
                      </main>
        } else if (registerError.status === 500) {
            content = <main className="registerForm">
                        <h2>Ett fel uppstod!</h2>
                        <p>Vänligen gå <a href="/register">tillbaka</a> och försök igen.</p>
                      </main>
        }
    }

    return (
        <div>{content}</div>
    )
}

export default Register;
