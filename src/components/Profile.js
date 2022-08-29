import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import profileIcon from "../svg/user-circle.svg";
import ProfilePlaceholder from "../components/ProfilePlaceholder";
import { TbEditCircle } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import LineBreak from "../components/LineBreak";

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
    return fetch("http://localhost:3001/user/updateuserfinances", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(data => data.json())
}

async function logoutUser() {
    const token = "Bearer " + JSON.parse(sessionStorage.getItem("token"));
    console.log(token);

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
    })
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

            setFinanceData(finalData);
            setFinanceDataUnchanged(finalData);
        };
        fetchFinanceData();
        setDataIsLoadedBool(true);
    }, [])

    if (!auth) {
        return <Navigate to ="/splash" />;
    }

    let content;

    const handleClick = e => {
        e.preventDefault();

        if (e.target.innerText === "Mina utgifter") {
            setContentState("myExpenses")
        } else if (e.target.innerText === "Byt lösenord") {
            setContentState("changePassword");
        } else if (e.target.innerText === "Logga ut") {
            console.log("CLICKED");
            logoutUser();
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        let userId = await getUserId();

        financeData.map(async (obj, index) => {
            if (obj.amount != financeDataUnchanged[index].amount) {
                const res = await updateFinance({
                    "userId": userId.data,
                    "title": obj.title,
                    "newAmount": obj.amount
                });

                console.log(res);
            }
        });

        setContentState("profileMenu");
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

        console.log(res);
        setContentState("profileMenu");
    }

    const handleChange = (e) => {
        e.preventDefault();

        let list = financeData;

        list = list.map(
            el => el.title === e.target.parentNode.firstChild.outerText ? { ...el, amount: e.target.value } : el
        );

        setFinanceData(list);
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
                <img className="icon" src={profileIcon} />
                <p>{sessionStorage.getItem("username")}</p>
            </div>
            <TbEditCircle />
        </div>
        <div className="profilePageMenu">
            <p>Hello expenses!</p>
            <form>
                {financeData.map((obj) => {
                    return <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount?obj.amount : ""}
                                    onChange={handleChange}
                                />
                            </div>
                })}
                <button onClick={handleSubmit}>Spara ändringar</button>
            </form>
        </div>
        </div>
    } else if (contentState === "changePassword") {
        content = <div>
            <div className="background">
            <div className="profile">
                <h3>Profil</h3>
                <img className="icon" src={profileIcon} />
                <p>{sessionStorage.getItem("username")}</p>
            </div>
            <TbEditCircle />
        </div>
        <div className="profilePageMenu">
            <form>
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
            { content }
        </div>
    );
}

export default Profile;
