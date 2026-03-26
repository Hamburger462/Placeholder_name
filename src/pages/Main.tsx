import { useContext } from "react";
import { authContext } from "../context/authContext";

import { useCases } from "../custom_hooks/useCasesSelectors";

export default function Main(){
    const userContext = useContext(authContext);
    const {allCases} = useCases();

    if(!userContext?.authInfo){
        return(
        <>
            <div>Sign up or login to an existing user</div>
        </>);
    }

    return (
    <>
        <h1>My cases</h1>
        
    </>
    );
}