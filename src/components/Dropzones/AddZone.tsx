import Droppable from "../Droppable";
import Draggable from "../Draggable";
import { type RefObject } from "react";
import { type Clue } from "../../types/clues";

import { useCluesForCase } from "../../custom_hooks/useClueSelectors";

import "../CaseBoard.css";

interface AddZoneProps {
    id: string;
    parentRef: RefObject<HTMLDivElement | null>;
    caseId: string;
}

export default function AddZone({ id, parentRef, caseId }: AddZoneProps) {
    const { pinClue } = useCluesForCase(caseId);

    const handleDragEnd = (
        dragPos: {
            x: number;
            y: number;
            setPos: React.Dispatch<
                React.SetStateAction<{ x: number; y: number }>
            >;
        },
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
    };

    return (
        <Droppable id={id} className="ClueDrop">
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
