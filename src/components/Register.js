import React, { useState } from "react";
import { useFormik } from "formik";
import { registerSchema } from "../schemas";

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
    const [usernameIsEntered, setUsernameBool] = useState(false);
    const [passwordIsEntered, setPasswordBool] = useState(false);
    const [registerError, setRegisterError] = useState({
        error: null,
        status: null
    });
    let content;

	const onSubmit = async (values, actions) => {
		console.log(values);

		const res = await createUser({
			"username": values.username,
			"password": values.password
		});

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

	const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
		initialValues: {
			username: "",
			password: ""
		},
		validationSchema: registerSchema,
		onSubmit
	});

    const handleButtons = e => {
        e.preventDefault();

        if (usernameIsEntered === false) {
            setUsernameBool(true);
        } else if (passwordIsEntered === false) {
            setPasswordBool(true);
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
                        <input
                            name="username"
                            type="username"
                            value={values.username}
							onChange={handleChange}
							onBlur={handleBlur}
                            key={1}
							className={errors.username && touched.username ? "input-error" : ""}
                        />
						{errors.username && touched.username && <p className="error">{errors.username}</p>}
                        <button onClick={handleButtons}>Nästa</button>
                  </main>
    } else if (!passwordIsEntered) {
        content = <main className="registerForm">
                    <h2>Välj ditt lösenord</h2>
                    <p>Kom ihåg att spara lösenordet så att du inte glömmer bort det.</p>

						<input
							name="password"
							type="password"
							value={values.password}
							onChange={handleChange}
							onBlur={handleBlur}
							key={2}
							className={errors.password && touched.password ? "input-error" : ""}
						/>
						{errors.password && touched.password && <p className="error">{errors.password}</p>}
                        <button onClick={handleButtons}>Nästa</button>
                        <a onClick={back}>Tillbaka</a>
                  </main>
    } else {
        content = <main className="registerForm">
                    <h2>Nästan där!</h2>
                    <p>Nu återstår bara att skapa kontot. Du kan gå tillbaka ifall du ångrar dig och vill ändra något.</p>
                        <button disabled={isSubmitting} type="submit" className="createAccountBtn">Skapa konto</button>
                        <a onClick={back}>Tillbaka</a>
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
        <div>
			<form onSubmit={handleSubmit}>
				{content}
			</form>
		</div>
    )
}

export default Register;
