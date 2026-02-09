import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./ClueElement.css";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import type { DraggableProps } from "./Draggable";

import { useContext } from "react";
import { DragContext } from "../context/dragContext";

export interface ClueProps {
    clueId: string;
}

export interface ClueItemProps {
    clue_data: ClueProps;
    drag_data: DraggableProps;
}

export default function ClueItem({ clue_data, drag_data }: ClueItemProps) {
    const { clue } = useCluesForClue(clue_data.clueId);
    const { unpinClue } = useCluesForCase(clue.caseId);

    const context = useContext(DragContext);

    const HandleClueDrop = (
        _: {
            x: number;
            y: number;
            setPos: React.Dispatch<
                React.SetStateAction<{ x: number; y: number }>
            >;
        },
        droppedId?: string | null,
    ) => {
        if (droppedId == "DEATHZONE") {
            unpinClue(clue.id);
        }
    };

    return (
        <>
            <Draggable
                onDragEnd={HandleClueDrop}
                initialX={drag_data.initialX}
                initialY={drag_data.initialY}
                parentRef={drag_data.parentRef}
                className="ClueElement"
            >
                <Droppable
                    id={`ConnectionDrop-${clue.id}`}
                    className="ConnectionDrop"
                    onMouseDown={context?.startConnection}
                >
                    <div>Connectable here</div>
                </Droppable>
                <div>Title: {clue.title}</div>
            </Draggable>
        </>
    );
}
