import type { Case} from "../types/clues";
import ClueElement from "../components/ClueElement";
import { useRef } from "react";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./CaseBoard.css";

import { DragProvider } from "../context/dragProvider";

import type { ClueProps} from "../components/ClueElement";

import type { DraggableProps } from "./Draggable";

import AddZone from "./Dropzones/AddZone";
import DeleteZone from "./Dropzones/DeleteZone";

type CaseBoardProps = {
    data: Case;
};

export default function Caseboard({ data }: CaseBoardProps) {
    const { cluesByCaseId } = useCluesForCase(
        data.id,
    );

    // const [title, useTitle] = useState("");

    // function addClue() {
    //     const newClue: Clue = {
    //         id: crypto.randomUUID(),
    //         caseId: data.id,
    //         title: title,
    //         position: {
    //             x: 0,
    //             y: 0,
    //         },
    //     };

    //     pinClue(newClue);
    // }

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="CaseBoard">
                <h2>This is a caseboard</h2>
                <div>{data.title}</div>

                <DragProvider>
                    <div className="ClueContainer" ref={containerRef}>
                        <AddZone parentRef={containerRef} caseId={data.id} id="Add"></AddZone>
                        <DeleteZone id="DEATHZONE"></DeleteZone>
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
