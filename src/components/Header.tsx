import { Link } from "react-router-dom";

import { authContext } from "../context/authContext";
import { useContext } from "react";

export default function Header() {
    const context = useContext(authContext);

    return (
        <header>
            <Link 
            style={{
                textDecoration: "none",
                color: "#121417",
                fontSize: "32px"
            }}
            className="header-logo nav-link"
            to="/">
                <img src=""></img>
                Soliloquy
            </Link>
            <nav className="header-nav">
                <Link 
                    style={{
                        textDecoration: "none",
                        color: "#121417",
                    }}  
                    className="nav-link"
                    to="/archive">
                    <img src="../../archive_active.png"></img>
                    Archive
                </Link>

                {!context?.authInfo ? (
                    <>
                        <Link 
                        style={{
                            textDecoration: "none",
                            color: "#121417",
                        }}
                        className="nav-link"
                        to="/auth/login">
                            Login
                        </Link>
                        <Link 
                        style={{
                            textDecoration: "none",
                            color: "#121417",
                        }}  
                        className="nav-link"
                        to="/auth/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <Link 
                    style={{
                        textDecoration: "none",
                        color: "#121417",
                    }} 
                    className="nav-link"
                    to="/profile">
                        <img src="../../user_active.png"></img>
                        Profile
                        </Link>
                )}
            </nav>
        </header>
    );
}
