import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./ClueElement.css";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import type { DraggableProps } from "./Draggable";

import { useContext, useEffect } from "react";
import { DragContext } from "../context/dragContext";

import { type onDragEndPos } from "./Draggable";

import { useConnectionsForCase, useConnections } from "../custom_hooks/useConnectionSelector";

export interface ClueProps {
    clueId: string;
}

export interface ClueItemProps {
    clue_data: ClueProps;
    drag_data: DraggableProps;
}

export default function ClueItem({ clue_data, drag_data }: ClueItemProps) {
    const { clue, changePos } = useCluesForClue(clue_data.clueId);
    const { unpinClue } = useCluesForCase(clue.caseId);

    const context = useContext(DragContext);

    const {connectionsByCaseId} = useConnectionsForCase(clue.caseId);

    const {unpinConnection} = useConnections();

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
            connectionsByCaseId.filter((value) => {
                if(value.startId == clue.id || value.endId == clue.id){
                    unpinConnection(value.id);
                }
            })
        }
    };

    const updateCluePos = (dragPos: onDragEndPos) => {
        changePos(dragPos.x, dragPos.y);
    }

    const checkConnection = () => {
        if(context?.ConnectionState){
            if(context?.ConnectionState?.isActive || context.ConnectionState.startId == clue.id){
                context?.endConnection(clue.id, clue.caseId);
            }
            else{
                context?.startConnection(clue.id, clue.position);
            }
        }
        else{
            context?.startConnection(clue.id, clue.position);
        }
    }

    return (
        <>
            <Draggable
                initialX={drag_data.initialX}
                initialY={drag_data.initialY}
                parentRef={drag_data.parentRef}
                className="ClueElement"

                onDragEnd={HandleClueDrop}
                onDragging={updateCluePos}
            >
                <Droppable
                    id={`ConnectionDrop-${clue.id}`}
                    className="ConnectionDrop"
                    onMouseDown={checkConnection}
                >
                    <div>Connectable here</div>
                </Droppable>
                <div>Title: {clue.title}</div>
            </Draggable>
        </>
    );
}
