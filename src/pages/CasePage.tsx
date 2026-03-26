import { useContext, useState, useEffect } from "react";
import { authContext } from "../context/authContext";

import Caseboard from "../components/CaseBoard";
import { type Case } from "../types/clues";

import { useParams, useNavigate } from "react-router-dom";

import { useCases } from "../custom_hooks/useCasesSelectors";
import { Button } from "@mui/material";

export default function CasePage() {
    const userContext = useContext(authContext);

    const { allCases } = useCases();

    const { id } = useParams();

    const [currentCase, setCurrentCase] = useState<Case | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        setCurrentCase(allCases.find((value) => value.id == id));
    }, [userContext?.activeCase]);

    return (
        <>
            <div>
                <Button
                    onClick={() => navigate("/archive")}
                    variant="contained"
                    style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
                >
                    Go back
                </Button>
            </div>

            {currentCase ? <Caseboard data={currentCase}></Caseboard> : null}
        </>
    );
}
