import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import profileIcon from "../svg/user-circle.svg";
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

function Profile({ auth }) {
    const [contentState, setContentState] = useState("profileMenu");
    const [financeData, setFinanceData] = useState();
    const [dataIsLoaded, setDataIsLoadedBool] = useState(false);

    useEffect(() => {
        const fetchFinanceData = async () => {
            const userId = await getUserId();

            const response = await fetch("http://localhost:3001/finances/getfinances", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"userid": userId.data})
            })

            const data = await response.json();

            const finalData = data.data.spendings[0].expenditure;

            //console.log(data.data.spendings[0].expenditure);

            setFinanceData({
                financeData: finalData
            });
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
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        console.log("clicked!");
    }

    const handleChange = (e) => {
        e.preventDefault();

        //console.log(financeData.financeData.spendings[0].expenditure);

        //setFinanceData(prevState => {
        //    prevState.map((obj) => {
        //        console.log(obj.title);
        //    })
        //    return;
        //})

        setFinanceData(prevState => ({
            financeData: prevState.financeData.map(
                el => el.title === e.target.parentNode.firstChild.outerText? { ...el, amount: e.target.value}: el
            )
        }));
    }

    if (contentState === "profileMenu") {
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
            <a onClick={handleClick}>
                <div className="menuItem"><p>Mina utgifter</p><IoIosArrowForward /></div>
                <LineBreak />
            </a>
            <a onClick={handleClick}>
                <div className="menuItem"><p>Byt lösenord</p><IoIosArrowForward /></div>
            </a>
            <LineBreak />
            <div className="menuItem"><p>Logga ut</p><IoIosArrowForward /></div>
            <LineBreak />
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
                {console.log(financeData)}
                {financeData.financeData.map((obj) => {
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
    }

    return (
        <div className="profilePage">
            { content }
        </div>
    );
}

export default Profile;
