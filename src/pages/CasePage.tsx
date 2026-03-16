import { useContext, useState, useEffect } from "react"
import { authContext } from "../context/authContext"

import Caseboard from "../components/CaseBoard"
import { type Case } from "../types/clues"

import { useParams, useNavigate } from "react-router-dom"

import { useCases } from "../custom_hooks/useCasesSelectors"
import { Button } from "@mui/material"

export default function CasePage(){
    const userContext = useContext(authContext);

    const { allCases } = useCases();

    const { id } = useParams();

    const [currentCase, setCurrentCase] = useState<Case | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        setCurrentCase(
            allCases.find((value) => value.id == id),
        );
    }, [userContext?.activeCase])
    
    return (<>
        <h1>This is a case page</h1>
        <Button onClick={() => navigate("/archive")} variant="contained">Go back</Button>

        {currentCase ? <Caseboard data={currentCase}></Caseboard> : null}
    </>)
}