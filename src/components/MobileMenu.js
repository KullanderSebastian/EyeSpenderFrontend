import * as React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoStatsChartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

function MobileMenu() {
    let activeStyle = {
        color: "black",
    };

    let activeClassName = "black";

    return (
        <nav className="mobileMenu">
            <ul className="items">
                <li>
                    <NavLink className="link" to="/dashboard">
                        <AiOutlineHome />
                        <br></br>
                        Hem
                        {({ isActive }) => (
                            <span className={isActive}></span>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink className="link" to="statistik">
                        <IoStatsChartOutline />
                        <br></br>
                        Statistik
                        {({ isActive }) => (
                            <span className={isActive}></span>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink className="link" to="/profile">
                        <CgProfile />
                        <br></br>
                        Profil
                        {({ isActive }) => (
                            <span className={isActive}></span>
                        )}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default MobileMenu;
