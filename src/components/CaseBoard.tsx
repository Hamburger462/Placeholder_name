import type { Case } from "../types/clues";

import { useRef, useState } from "react";

import { useCluesForCase } from "../custom_hooks/useClueSelectors";
import { useCases } from "../custom_hooks/useCasesSelectors";

import { db } from "../database/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { DragProvider } from "../context/dragProvider";

import type { ClueProps } from "../components/ClueElement";

import type { DraggableProps } from "./Draggable";

import ClueElement from "../components/ClueElement";
import AddZone from "./Dropzones/AddZone";
import DeleteZone from "./Dropzones/DeleteZone";
import ConnectionLayer from "./ConnectionLayer";
import ClueModal from "./ClueModal";

import Button from "@mui/material/Button";
import TextInput from "./Inputs/TextInput";

import { useNavigate } from "react-router-dom";

import "../styles/CaseBoard.css";

type CaseBoardProps = {
    data: Case;
};

export default function Caseboard({ data }: CaseBoardProps) {
    const navigate = useNavigate();

    const { cluesByCaseId } = useCluesForCase(data.id);

    const containerRef = useRef<HTMLDivElement>(null);

    const [caseTitle, setCaseTitle] = useState<string>(data.title);
    const [caseStatus, setCaseStatus] = useState<string>(data.status);

    const { renewCase, unpinCase } = useCases();

    const saveCaseChanges = async () => {
        // Updating a case title
        renewCase({
            id: data.id,
            changes: {
                title: caseTitle,
                status: caseStatus,
            },
        });

        await updateDoc(doc(db, "Cases", data.id), {
            title: caseTitle,
            status: caseStatus,
        });
        
        window.alert("Changes saved");
    };

    const deleteCase = async () => {
        if (window.confirm("Are you sure?")) {
            unpinCase(data.id);

            navigate("/archive")

            await deleteDoc(doc(db, "Cases", data.id));
        }
    };

    const changeStatus = (event: React.ChangeEvent) => {
        setCaseStatus((event.target as HTMLInputElement).value);
    }

    return (
        <>
            <div className="CaseBoard">
                <div className="CaseName">
                    {/* <h1>{data.title}</h1> */}
                    <TextInput
                        content={caseTitle}
                        setContent={setCaseTitle}
                        name="title"
                        className="CaseTitle"
                    ></TextInput>

                    <div className="CaseEdit">
                        <form className="CaseEditForm">
                            <label className={caseStatus == "in-progress" ? "CaseEditRadio CaseEditRadioActive" : "CaseEditRadio"} title="in-progress">
                                <img className="CaseEditRadioImg" src="../../in-progress.png"></img>
                                <input className="CaseEditRadioBtn" type="radio" name="status" value={"in-progress"} onChange={changeStatus}></input>
                            </label>
                            <label className={caseStatus == "solved" ? "CaseEditRadio CaseEditRadioActive" : "CaseEditRadio"} title="solved">
                                <img className="CaseEditRadioImg" src="../../solved.png"></img>
                                <input className="CaseEditRadioBtn" type="radio" name="status" value={"solved"}  onChange={changeStatus}></input>
                            </label>
                            <label className={caseStatus == "postponed" ? "CaseEditRadio CaseEditRadioActive" : "CaseEditRadio"} title="postponed">
                                <img className="CaseEditRadioImg" src="../../postponed.png"></img>
                                <input className="CaseEditRadioBtn" type="radio" name="status" value={"postponed"}  onChange={changeStatus}></input>
                            </label>
                        </form>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
                            onClick={saveCaseChanges}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
                            onClick={deleteCase}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <DragProvider parentRef={containerRef}>
                    <div className="ClueContainer" ref={containerRef}>
                        <ConnectionLayer caseId={data.id}></ConnectionLayer>
                        <AddZone
                            parentRef={containerRef}
                            caseId={data.id}
                        ></AddZone>

                        <DeleteZone caseId={data.id}></DeleteZone>

                        {cluesByCaseId.map((elem) => {
                            const clue_data: ClueProps = {
                                clueId: elem.id,
                            };

                            const drag_data: DraggableProps = {
                                initialX: elem.position.x,
                                initialY: elem.position.y,
                                parentRef: containerRef,
                            };

                            return (
                                <ClueElement
                                    clue_data={clue_data}
                                    drag_data={drag_data}
                                    key={elem.id}
                                ></ClueElement>
                            );
                        })}

                        <ClueModal></ClueModal>
                    </div>
                </DragProvider>
            </div>
        </>
    );
}
