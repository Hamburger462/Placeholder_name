import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "../styles/ClueElement.css";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import type { DraggableProps } from "./Draggable";

import React, { useContext, useRef } from "react";
import { DragContext } from "../context/dragContext";
import { authContext } from "../context/authContext";

import { type onDragEndPos } from "./Draggable";

import {
    useConnectionsForCase,
    useConnections,
} from "../custom_hooks/useConnectionSelector";

import { Button } from "@mui/material";

import { db } from "../database/firebase";
import {
    collection,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore";

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
    const userContext = useContext(authContext);

    const { connectionsByCaseId } = useConnectionsForCase(clue.caseId);

    const { unpinConnection, renewConnection } = useConnections();

    const HandleClueDrop = async (
        dragPos: onDragEndPos,
        droppedId?: string | null,
    ) => {
        if (!userContext?.activeCase) return;

        const dropId = droppedId?.split("-")[0];

        if (dropId == "DEATHZONE") {
            unpinClue(clue.id);
            connectionsByCaseId.filter((value) => {
                if (value.startId == clue.id || value.endId == clue.id) {
                    unpinConnection(value.id);
                }
            });

            const col = collection(
                db,
                "Cases",
                userContext.activeCase,
                "Connections",
            );

            await deleteDoc(
                doc(db, "Cases", userContext.activeCase, "Clues", clue.id),
            );

            // check startId first
            const startQuery = query(col, where("startId", "==", clue.id));
            const startSnap = await getDocs(startQuery);

            if (!startSnap.empty) {
                const connection = startSnap.docs[0];
                await deleteDoc(
                    doc(
                        db,
                        "Cases",
                        userContext.activeCase,
                        "Connections",
                        connection.id,
                    ),
                );
                return;
            }

            // otherwise check endId
            const endQuery = query(col, where("endId", "==", clue.id));
            const endSnap = await getDocs(endQuery);

            if (!endSnap.empty) {
                const connection = endSnap.docs[0];
                await deleteDoc(
                    doc(
                        db,
                        "Cases",
                        userContext.activeCase,
                        "Connections",
                        connection.id,
                    ),
                );
            }
        } else if (dropId === "ADDZONE" || !dropId) {
            // Snap back
            dragPos.setPos({ x: dragPos.startX, y: dragPos.startY });

            // Use the original center of the clue element
            const resetPoint = {
                x: dragPos.startX + dragPos.width / 2,
                y: dragPos.startY,
            };

            connectionsByCaseId.forEach((conn) => {
                if (conn.startId === clue.id) {
                    renewConnection({
                        id: conn.id,
                        changes: { pos1: resetPoint },
                    });
                }
                if (conn.endId === clue.id) {
                    renewConnection({
                        id: conn.id,
                        changes: { pos2: resetPoint },
                    });
                }
            });

            await updateDoc(
                doc(db, "Cases", userContext.activeCase, "Clues", clue.id),
                {
                    position: {
                        x: dragPos.x,
                        y: dragPos.y,
                    },
                },
            );
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

        changePos(dragPos.x, dragPos.y);

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

    const index = context?.dragOrder.indexOf(clue.id) ?? -1;
    const zIndex = index >= 0 ? index + 1 : 0;

    const updateDragOrder = () => {
        context?.setDragOrder(clue.id);
    };

    const editClue = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        context?.setActiveClue(clue.id);
    };

    return (
        <>
            <Draggable
                initialX={drag_data.initialX}
                initialY={drag_data.initialY}
                parentRef={drag_data.parentRef}
                className="ClueElement"
                z_index={zIndex}
                onDragStart={updateDragOrder}
                onDragEnd={HandleClueDrop}
                onDragging={updateCluePos}
            >
                <Droppable
                    ref={connectionRef}
                    id={`ConnectionDrop-${clue.id}`}
                    className="ConnectionDrop"
                    onMouseDown={checkConnection}
                >
                    <img className="DropPin" src="../pin_active.png"></img>
                </Droppable>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "18px",
                    }}
                >
                    {clue.title}
                    <Button
                        variant="contained"
                        style={{
                                backgroundColor: "#C2A35D",
                                color: "#E6E6E6",
                            }}
                        onClick={(e) => {
                            e.stopPropagation();
                            editClue(e);
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </Draggable>
        </>
    );
}
