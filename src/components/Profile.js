import React from "react";
import { Redirect } from "react-router-dom";
import profileIcon from "../svg/user-circle.svg";

function Profile({ auth }) {
    if (!auth) {
        return <Redirect to ="/splash" />;
    }
    return (
        <div className="profile">
            <h3>Profil</h3>
            <img className="profileIcon" src={profileIcon} />
            <p>{sessionStorage.getItem("username")}</p>
        </div>
    );
}

export default Profile;
