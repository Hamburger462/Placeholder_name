import { Link } from "react-router-dom";

import { authContext } from "../context/authContext";
import { useContext } from "react";

export default function Header() {
    const context = useContext(authContext);

    return (
        <header>
            <Link 
            className="header-logo nav-link"
            to="/">
                <img src=""></img>
                Soliloquy
            </Link>
            <nav className="header-nav">
                <Link 
                    className="nav-link"
                    to="/archive">
                    <img src="../../archive_active.png"></img>
                    Archive
                </Link>

                {!context?.authInfo ? (
                    <>
                        <Link 
                        className="nav-link"
                        to="/auth/login">
                            Login
                        </Link>
                        <Link 
                        className="nav-link"
                        to="/auth/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <Link 
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
