import React from "react";
import { Navigate } from "react-router-dom";
import profileIcon from "../svg/user-circle.svg";
import { TbEditCircle } from "react-icons/tb";


function Profile({ auth }) {
    if (!auth) {
        return <Navigate to ="/splash" />;
    }
    return (
        <div className="profilePage">
            <div className="background">
                <div className="profile">
                    <h3>Inställningar</h3>
                    <img className="icon" src={profileIcon} />
                    <p>{sessionStorage.getItem("username")}</p>
                </div>
                <TbEditCircle />
            </div>
            <div className="profileInformationPage">
                <h3>Mina finanser</h3>
                <p>Hyra: 8500kr</p>
                <p>Mat: 3000kr</p>
                <p>Hemförsäkring: 300kr</p>
                <p>Snus: 1500kr</p>
                <p>Kläder: 1000kr</p>
                <p>Fonder: 1000kr</p>
                <button>Ändra</button>
            </div>
        </div>
    );
}

export default Profile;
