import { useContext } from "react";
import { authContext } from "../context/authContext";

export default function Main(){
    const userContext = useContext(authContext);

    return (
    <>
        <h1>This is main page</h1>
        
    </>
    );
}