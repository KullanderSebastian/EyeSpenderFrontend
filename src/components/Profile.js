import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import profileIcon from "../svg/user-circle.svg";
import ProfilePlaceholder from "../components/ProfilePlaceholder";
import { TbEditCircle } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { BsArrowLeftCircle } from "react-icons/bs";
import LineBreak from "../components/LineBreak";
import { useFormik } from "formik";
import { financesSchema2 } from "../schemas";

async function getUserId() {
    return fetch("http://localhost:3001/users/getuserid", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": sessionStorage.getItem("username")})
    })
    .then(data => data.json())
}

async function updateFinance(data) {
    return fetch("http://localhost:3001/users/updateuserfinances", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(data => data.json())
}

async function changePassword(data) {
    return fetch("http://localhost:3001/users/changepassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(data => data.json())
}

function Profile({ auth }) {
    const [contentState, setContentState] = useState("profileMenu");
    const [financeData, setFinanceData] = useState();
    const [financeDataUnchanged, setFinanceDataUnchanged] = useState();
    const [dataIsLoaded, setDataIsLoadedBool] = useState(false);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordChecker, setNewPasswordChecker] = useState();
    const [profileLetter, setProfileLetter] = useState(sessionStorage.getItem("username").charAt(0).toUpperCase());
	const [isLoggedOut, setIsLoggedOut] = useState(false);
	const [errorState, setErrorState] = useState();
	const navigate = useNavigate();

	let content;

	const onSubmit = async (values, actions) => {
		financeData.map(async (obj) => {
			const res = await updateFinance({
				"username": sessionStorage.getItem("username"),
				"title": obj.title,
				"newAmount": values[obj.category]
			});

			console.log(res);
		});

        setContentState("profileMenu");
    }

	const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
		initialValues: {
			rent: "",
			homeinsurance: "",
			food: "",
			petrol: "",
			carinsurance: "",
			slcard: "",
			mobilebill: "",
			tobacco: "",
			clothes: "",
			training: "",
			stocks: "",
			savings: "",
			pension: ""
		},
		validationSchema: financesSchema2,
		onSubmit
	});

	async function logoutUser() {
	    const token = "Bearer " + JSON.parse(sessionStorage.getItem("token"));

	    return fetch("http://localhost:3001/users/logout", {
	        credentials: "include",
	        method: "PATCH",
	        headers: {
	            "Content-Type": "application/json",
	            "Authorization": token
	        },
	        body: JSON.stringify({"username": sessionStorage.getItem("username")})
	    })
	    .then(data => data.json())
	    .then(function(){
	        sessionStorage.clear();
			sessionStorage.username = "temp";
			setIsLoggedOut(true);
	    })
	}

    useEffect(() => {
        const fetchFinanceData = async () => {
            const userId = await getUserId();

            const response = await fetch("http://localhost:3001/users/getuserfinances", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"username": sessionStorage.getItem("username")})
            })

            const data = await response.json();

            const finalData = data.data;

			data.data.map(obj => {
				values[obj.category] = obj.amount;
			});

            setFinanceData(finalData);
            setFinanceDataUnchanged(finalData);
        };
        fetchFinanceData();
        setDataIsLoadedBool(true);

		if (isLoggedOut) {
			navigate("/splash", { replace:true });
		}
    }, [isLoggedOut, navigate])

    if (!auth) {
        return <Navigate to ="/splash" />;
    }

    const handleClick = e => {
        e.preventDefault();

        if (e.target.innerText === "Mina utgifter") {
            setContentState("myExpenses")
        } else if (e.target.innerText === "Byt lösenord") {
            setContentState("changePassword");
        }
    }

    const handleSubmitPassword = async e => {
        e.preventDefault();

        console.log(currentPassword);
        console.log(newPassword);
        console.log(newPasswordChecker);

        const res = await changePassword({
            "username": sessionStorage.getItem("username"),
            "password": currentPassword,
            "newPassword": newPassword,
            "newPasswordCheck": newPasswordChecker
        });

		if (res.error) {
			setErrorState(res.message);
			return;
		}

        console.log(res);
		setCurrentPassword(null);
		setNewPassword(null);
		setNewPasswordChecker(null);
		setErrorState(null);
        setContentState("profileMenu");
    }

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (e.target.name === "currentPassword") {
            setCurrentPassword(e.target.value);
        } else if (e.target.name === "newPassword") {
            setNewPassword(e.target.value);
        } else if (e.target.name === "newPasswordChecker") {
            setNewPasswordChecker(e.target.value);
        }
    }

	const goBack = () => {
		setContentState("profileMenu");
	}

    if (contentState === "profileMenu") {
        content = <div>
            <div className="background">
            <div className="profile">
                <h3>Profil</h3>
                <div className="profilePicture">
                    <ProfilePlaceholder letter={profileLetter}/>
                </div>
            </div>
            <TbEditCircle />
        </div>
        <div className="profilePageMenu">
            <a onClick={handleClick}>
                <div className="menuItem"><p>Mina utgifter</p><IoIosArrowForward /></div>
                <LineBreak />
            </a>
            <a onClick={handleClick}>
                <div className="menuItem"><p>Byt lösenord</p><IoIosArrowForward /></div>
                <LineBreak />
            </a>
            <a onClick={logoutUser}>
                <div className="menuItem"><p>Logga ut</p><IoIosArrowForward /></div>
                <LineBreak />
            </a>
        </div>
        </div>
    } else if (contentState === "myExpenses") {
        content = <div>
            <div className="background">
			<div className="profile">
                <h3>Profil</h3>
                <div className="profilePicture">
                    <ProfilePlaceholder letter={profileLetter}/>
                </div>
            </div>
            <TbEditCircle />
        </div>
        <div className="profilePageMenu">
			<BsArrowLeftCircle onClick={goBack} />
            <p>Hello expenses!</p>
                {financeData.map((obj) => {
	                return 	<div>
								<div className="testInputs">
	                                <h3>{obj.title}</h3>
	                                <input
	                                    name={obj.category}
										type={obj.category}
	                                    value={values[obj.category] === 0 ? null : values[obj.category]}
										onChange={handleChange}
										onBlur={handleBlur}
										className={errors[obj.category] && touched[obj.category] ? "input-error" : ""}
	                                />
	                            </div>
								<div>
									{errors[obj.category] && touched[obj.category] && <p className="error">{errors[obj.category]}</p>}
								</div>
							</div>
	            })}
	            <button disabled={isSubmitting} type="submit">Spara ändringar</button>
        </div>
        </div>
    } else if (contentState === "changePassword") {
        content = <div>
            <div className="background">
			<div className="profile">
                <h3>Profil</h3>
                <div className="profilePicture">
                    <ProfilePlaceholder letter={profileLetter}/>
                </div>
            </div>
            <TbEditCircle />
        </div>
        <div className="profilePageMenu">
			<BsArrowLeftCircle onClick={goBack} />
            <form>
				{errorState ? <p className="error">{errorState}</p> : null}
                <input
                    name="currentPassword"
                    key={1}
                    value={currentPassword ? currentPassword : ""}
                    onChange={handleChangePassword}
                    placeholder="Nuvarande lösenord"
                />
            {currentPassword}
                <LineBreak />
                <input
                    name="newPassword"
                    key={2}
                    value={newPassword ? newPassword : ""}
                    onChange={handleChangePassword}
                    placeholder="Nytt lösenord"
                />
            {newPassword}
                <LineBreak />
                <input
                    name="newPasswordChecker"
                    key={3}
                    value={newPasswordChecker ? newPasswordChecker : ""}
                    onChange={handleChangePassword}
                    placeholder="Nytt lösenord"
                />
            {newPasswordChecker}
            <button onClick={handleSubmitPassword}>Ändra lösenord</button>
            </form>
        </div>
        </div>
    }

    return (
        <div className="profilePage">
			<form onSubmit={handleSubmit}>
	            { content }
			</form>
        </div>
    );
}

export default Profile;
