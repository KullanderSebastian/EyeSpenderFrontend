import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "../schemas";
import { useNavigate } from "react-router-dom";
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
	const [errorState, setErrorState] = useState();
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
        const token = await loginUser({
            "username": values.username,
			"password": values.password
        });

		if (token.error) {
			setErrorState(token.message);
		} else {
			sessionStorage.setItem("username", values.username);
	        setToken(token.token);

			let status = await getUserSetupStatus(values.username);

			if (status.data === false) {
				navigate("/finances");
			} else {
				navigate("/dashboard");
			}
		}
    }

	const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
		initialValues: {
			username: "",
			password: ""
		},
		validationSchema: loginSchema,
		onSubmit
	});

    return (
        <main className="loginForm">
			{errorState ? <p className="error">{errorState}</p> : null}
            <form onSubmit={handleSubmit}>
                <input
					name="username"
					type="username"
					value={values.username}
					onChange={handleChange}
					onBlur={handleBlur}
					className={errors.username && touched.username ? "input-error" : ""}
                />
				{errors.username && touched.username && <p className="error">{errors.username}</p>}
                <input
                    name="password"
                    type="password"
					value={values.password}
                    onChange={handleChange}
					onBlur={handleBlur}
                    className={errors.password && touched.password ? "input-error" : ""}
                />
				{errors.password && touched.password && <p className="error">{errors.password}</p>}
            <button disabled={isSubmitting} type="submit" className="loginBtn">Logga in</button>
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
