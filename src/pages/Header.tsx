import { Link } from "react-router-dom";

import { authContext } from "../context/authContext";
import { useContext } from "react";

export default function Header() {
    const context = useContext(authContext);

    return (
        <header>
            <nav className="HeaderNav">
                <Link to="/">Main</Link>
                <Link to="/archive">Archive</Link>
                {!context?.authInfo ? (
                    <>
                        <Link to="/auth/login">Login</Link>
                        <Link to="/auth/register">Register</Link>
                    </>
                ) : (
                    <Link to="/profile">Profile</Link>
                )}
            </nav>
        </header>
    );
}
