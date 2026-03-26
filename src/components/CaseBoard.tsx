import type { Case } from "../types/clues";

import { useRef } from "react";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "../styles/CaseBoard.css";

import { DragProvider } from "../context/dragProvider";

import type { ClueProps } from "../components/ClueElement";

import type { DraggableProps } from "./Draggable";

import ClueElement from "../components/ClueElement";
import AddZone from "./Dropzones/AddZone";
import DeleteZone from "./Dropzones/DeleteZone";
import ConnectionLayer from "./ConnectionLayer";
import ClueModal from "./ClueModal";

import Button from "@mui/material/Button";

type CaseBoardProps = {
    data: Case;
};

export default function Caseboard({ data }: CaseBoardProps) {
    const { cluesByCaseId } = useCluesForCase(data.id);

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="CaseBoard">
                <div className="CaseName">
                    <h1>{data.title}</h1>

                    <div className="CaseEdit">
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
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
