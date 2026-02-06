import type { Case, Clue } from "../types/clues";
import ClueElement from "../components/ClueElement";
import { useState, useRef } from "react";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./CaseBoard.css";

import { DragProvider } from "../context/dragProvider";

import type { ClueProps} from "../components/ClueElement";

import type { DraggableProps } from "./Draggable";

import AddZone from "./Dropzones/Addzone";
import DeleteZone from "./Dropzones/DeleteZone";

type CaseBoardProps = {
    data: Case;
};

export default function Caseboard({ data }: CaseBoardProps) {
    const { cluesByCaseId, pinClue, unpinClue, renewClue } = useCluesForCase(
        data.id,
    );

    const [title, useTitle] = useState("");

    function addClue() {
        const newClue: Clue = {
            id: crypto.randomUUID(),
            caseId: data.id,
            title: title,
            position: {
                x: 0,
                y: 0,
            },
        };

        pinClue(newClue);
    }

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="CaseBoard">
                <h2>This is a caseboard</h2>
                <div>{data.title}</div>
                <form>
                    <label>
                        <span>Title</span>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(event) => useTitle(event.target.value)}
                        ></input>
                    </label>
                </form>
                <button onClick={addClue}>Add a clue</button>

                <DragProvider>
                    <div className="ClueContainer" ref={containerRef}>
                        <AddZone className="ClueDrop" id="Add"></AddZone>
                        <DeleteZone className="ClueDrop" id="Delete"></DeleteZone>
                        {cluesByCaseId.map((elem) => {
                            const clue_data: ClueProps = {
                                clueId: elem.id
                            }

                            const drag_data: DraggableProps = {
                                initialX: elem.position.x,
                                initialY: elem.position.y,
                                parentRef: containerRef
                            }

                            return (<ClueElement clue_data={clue_data} drag_data={drag_data} key={elem.id}></ClueElement>)
                        })}
                    </div>
                </DragProvider>
            </div>
        </>
    );
}
