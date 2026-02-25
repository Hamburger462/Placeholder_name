import "../../styles/CaseBoard.css"

import Droppable from "../Droppable";
import Draggable from "../Draggable";

import { type RefObject, useContext } from "react";

import { useCluesForCase } from "../../custom_hooks/useClueSelectors";
import { type Clue } from "../../types/clues";
import { useCases } from "../../custom_hooks/useCasesSelectors";

import { type onDragEndPos } from "../Draggable";

import { DragContext } from "../../context/dragContext";

interface AddZoneProps {
    parentRef: RefObject<HTMLDivElement | null>;
    caseId: string;
}

export default function AddZone({ parentRef, caseId }: AddZoneProps) {
    const { cluesByCaseId, pinClue } = useCluesForCase(caseId);
    const { allCases, renewCase } = useCases();

    const context = useContext(DragContext);
    const caseItem = allCases.find((value) => value.id == caseId);

    const handleDragEnd = (
        dragPos: onDragEndPos,
        droppedId?: string | null,
    ) => {
        // If dropped over ANY droppable → reset
        if (droppedId?.split("-")[0] !== "ConnectionDrop" && droppedId !== null) {
            dragPos.setPos({ x: 0, y: 0 });
            return;
        }

        // If dropped over nothing → create clue
        const newClue: Clue = {
            title: `Clue-${cluesByCaseId.length + 1}`,
            id: crypto.randomUUID(),
            caseId,
            position: { x: dragPos.x, y: dragPos.y },
        };

        dragPos.setPos({ x: 0, y: 0 });
        pinClue(newClue);

        renewCase({id: caseId, changes: {
            clueIds: [...caseItem?.clueIds as Array<string>, newClue.id]
        }})

        context?.setActiveClue(newClue.id);
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
