import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./ClueElement.css";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import type { DraggableProps } from "./Draggable";

import { useContext, useRef } from "react";
import { DragContext } from "../context/dragContext";

import { type onDragEndPos } from "./Draggable";

import {
    useConnectionsForCase,
    useConnections,
} from "../custom_hooks/useConnectionSelector";

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

    const { connectionsByCaseId } = useConnectionsForCase(clue.caseId);

    const { unpinConnection, renewConnection } = useConnections();

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
                if (value.startId == clue.id || value.endId == clue.id) {
                    unpinConnection(value.id);
                }
            });
        }
    };

    const connectionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = drag_data.parentRef;

    const updateCluePos = (dragPos: onDragEndPos) => {
        if (!connectionRef.current || !containerRef.current) return;

        const rect = connectionRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const point = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
        };

        // 1️⃣ Update clue position in state
        changePos(dragPos.x, dragPos.y);

        // 2️⃣ Update all related connections
        connectionsByCaseId.forEach((conn) => {
            if (conn.startId === clue.id) {
                renewConnection({
                    id: conn.id,
                    changes: {
                        pos1: point,
                    },
                });
            }

            if (conn.endId === clue.id) {
                renewConnection({
                    id: conn.id,
                    changes: {
                        pos2: point,
                    },
                });
            }
        });
    };

    const checkConnection = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!connectionRef.current || !containerRef.current) return;

        const rect = connectionRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const point = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
        };

        if (context?.connectionState?.isActive) {
            context.endConnection(clue.id, point, clue.caseId);
        } else {
            context!.startConnection(clue.id, point, clue.caseId);
        }
    };

    const updateDragOrder = () => {

    }

    return (
        <>
            <Draggable
                initialX={drag_data.initialX}
                initialY={drag_data.initialY}
                parentRef={drag_data.parentRef}
                className="ClueElement"
                onDragStart={updateDragOrder}
                onDragEnd={HandleClueDrop}
                onDragging={updateCluePos}
            >
                <Droppable
                    ref={connectionRef}
                    id={`ConnectionDrop-${clue.id}`}
                    className="ConnectionDrop"
                    onMouseDown={checkConnection}
                ></Droppable>
                <div>Title: {clue.title}</div>
            </Draggable>
        </>
    );
}
