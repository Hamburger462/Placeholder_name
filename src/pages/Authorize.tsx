import { Outlet } from "react-router-dom";

export function Login() {
    return (
        <>
            <h3>This is a login</h3>
        </>
    );
}

export function Register(){
    return(
        <>
            <h3>This is a register</h3>
        </>
    )
}

export default function Authorize() {
    return(
        <>
            <h2>This is authorize</h2>

            <Outlet />
        </>
    )
}
