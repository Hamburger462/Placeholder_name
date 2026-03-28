import { useState, useContext } from "react";
import { useCases } from "../custom_hooks/useCasesSelectors";
import { type Case } from "../types/clues";

import { setDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase";

import { authContext } from "../context/authContext";

import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import TextInput from "../components/Inputs/TextInput";

export default function Archive() {
    const navigate = useNavigate();

    const context = useContext(authContext);

    const [caseTitle, setCaseTitle] = useState("Case of ");

    const { allCases, pinCase } = useCases();

    async function addCase() {
        if (!context?.authInfo) {
            alert("Sign in to create a new case");
            return;
        }

        const newCase: Case = {
            id: crypto.randomUUID(),
            title: caseTitle,
            clueIds: [],
            status: "in-progress",
        };

        pinCase(newCase);

        context.setActiveCase(newCase.id);

        await setDoc(doc(db, "Cases", `${newCase.id}`), {
            title: caseTitle,
            userId: context?.authInfo?.id,
            status: "in-progress",
            createdAt: Date.now(),
        });

        setCaseTitle("Case of ");
    }

    return (
        <>
            <h1>Archive</h1>

            <div className="CaseContainer">
                <form className="CaseLink" style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <TextInput content={caseTitle} setContent={setCaseTitle} name="NewCaseTitle" className="CaseForm"></TextInput>
                    <Button variant="contained" onClick={addCase} style={{backgroundColor: "#d6cbb8", color: "#121417"}}>Add to the archive</Button>
                </form>

                {allCases.map((value) => {
                    return (
                        <div
                            key={value.id}
                            onClick={() => {
                                navigate(`/case/${value.id}`);
                                context?.setActiveCase(value.id);
                            }}
                            className="CaseLink"
                        >
                            <div className="CaseLinkTitle">{value.title}</div>
                            <div className="CaseLinkStatus">
                                Status:{" "}
                                <span style={{ color: "#5A5146" }}>
                                    {value.status}
                                </span>
                            </div>
                            <div>Clues: {value.clueIds?.length}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
