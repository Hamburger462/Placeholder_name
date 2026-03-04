import { Link } from "react-router-dom";

export default function Header() {
    return (
        <nav>
            <Link to="/">Main</Link>
            <Link to="/archive">Archive</Link>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
        </nav>
    );
}
