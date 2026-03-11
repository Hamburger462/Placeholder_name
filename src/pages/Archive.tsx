import { useState, useContext, useEffect } from "react";
import { useCases } from "../custom_hooks/useCasesSelectors";
import { type Case } from "../types/clues";
import Caseboard from "../components/CaseBoard";

import { setDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase";

import { authContext } from "../context/authContext";

import Button from "@mui/material/Button";

export default function Archive() {
    const context = useContext(authContext);

    const [caseTitle, useCaseTitle] = useState("");

    const { allCases, pinCase } = useCases();

    const [currentCase, setCurrentCase] = useState<Case | undefined>(undefined);

    useEffect(() => {
        setCurrentCase(
            allCases.find((value) => value.id == context?.activeCase),
        );
    }, [context?.activeCase]);

    async function addCase() {
        if (!context?.authInfo) {
            alert("Sign in to create a new case");
            return;
        }

        const newCase: Case = {
            id: crypto.randomUUID(),
            title: caseTitle,
            clueIds: [],
        };

        pinCase(newCase);

        context.setActiveCase(newCase.id);

        await setDoc(doc(db, "Cases", `${newCase.id}`), {
            title: caseTitle,
            userId: context?.authInfo?.id,
        });
    }

    return (
        <>
            <h1>This is archive</h1>
            <form>
                <label>
                    <input
                        type="text"
                        placeholder="Case #"
                        value={caseTitle}
                        onChange={(event) => useCaseTitle(event.target.value)}
                    />
                </label>
            </form>
            <button onClick={addCase}>Add case</button>

            <div className="CaseContainer">
                {allCases.map((value) => {
                    return (
                        <Button
                            onClick={() => context?.setActiveCase(value.id)}
                            variant="contained"
                            key={crypto.randomUUID()}
                        >
                            {value.title}
                        </Button>
                    );
                })}
            </div>

            {currentCase ? <Caseboard data={currentCase}></Caseboard> : null}
        </>
    );
}
