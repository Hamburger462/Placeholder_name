import "../../styles/CaseBoard.css"

import Droppable from "../Droppable";
import Draggable from "../Draggable";

import { type RefObject, useContext } from "react";

import { useCluesForCase } from "../../custom_hooks/useClueSelectors";
import { type Clue } from "../../types/clues";

import { type onDragEndPos } from "../Draggable";

import { DragContext } from "../../context/dragContext";

interface AddZoneProps {
    parentRef: RefObject<HTMLDivElement | null>;
    caseId: string;
}

export default function AddZone({ parentRef, caseId }: AddZoneProps) {
    const { pinClue } = useCluesForCase(caseId);

    const context = useContext(DragContext);

    const handleDragEnd = (
        dragPos: onDragEndPos,
        droppedId?: string | null,
    ) => {
        // If dropped over ANY droppable → reset
        if (droppedId) {
            dragPos.setPos({ x: 0, y: 0 });
            return;
        }

        // If dropped over nothing → create clue
        const newClue: Clue = {
            id: crypto.randomUUID(),
            caseId,
            position: { x: dragPos.x, y: dragPos.y },
        };

        dragPos.setPos({ x: 0, y: 0 });
        pinClue(newClue);

        context?.setModal(true);
    };

    return (
        <Droppable id={`ADDZONE-${caseId}`} className="ClueDrop AddZoneDrop">
            <Draggable
                initialX={0}
                initialY={0}
                parentRef={parentRef}
                onDragEnd={handleDragEnd}
                className="AddZoneClue"
            >
                <div>NEW NOTE</div>
            </Draggable>
        </Droppable>
    );
}
