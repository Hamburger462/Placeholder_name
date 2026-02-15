import { useState, useRef, useEffect } from "react";
import type { RefObject } from "react";

import { DragContext } from "./dragContext";
import type {
    DragState,
    Droppable,
    ActiveElem,
    ConnectionState,
} from "./dragContext";

import { useConnections } from "../custom_hooks/useConnectionSelector";
import { type Connection } from "../types/clues";

interface DragProvider {
    children: React.ReactNode;
    parentRef: RefObject<HTMLDivElement | null>;
}

export function DragProvider({ children, parentRef }: DragProvider) {
    const [activeDrag, setActiveDrag] = useState<ActiveElem>(null);

    const connectionStateRef = useRef<ConnectionState | null>(null);
    const connectionRef = useRef<Connection>(null);
    const mouseHandlerRef = useRef<(e: MouseEvent) => void>(null);

    const { allConnections, pinConnection, unpinConnection, renewConnection } =
        useConnections();

    let boardRect: any;

    useEffect(() => {
        const handleBoardClick = (e: MouseEvent) => {
            if (!connectionStateRef.current) return;

            // Check if the click target is a ConnectionDrop
            const target = e.target as HTMLElement;
            if (!target.closest(".ConnectionDrop")) {
                console.log("Cancelled connection");
                cancelConnection();
            }
        };

        window.addEventListener("mousedown", handleBoardClick);

        return () => {
            window.removeEventListener("mousedown", handleBoardClick);
        };
    }, []);

    const cancelConnection = () => {
        if (!connectionStateRef.current) return;

        // Remove temporary mouse tracking
        if (mouseHandlerRef.current) {
            window.removeEventListener("mousemove", mouseHandlerRef.current);
        }

        // Remove temporary connection
        unpinConnection("TempConnection");

        connectionStateRef.current = null;
        connectionRef.current = null;

        console.log("Connection cancelled");
    };

    const startConnection = (
        id: string,
        point: { x: number; y: number },
        caseId?: string,
    ) => {
        console.log("Connection started");

        connectionStateRef.current = {
            isActive: true,
            startId: id,
            startPoint: point,
            mouse: point,
        };

        connectionRef.current = {
            id: crypto.randomUUID(),
            caseId: caseId,
            startId: id,
            endId: null,
            pos1: point,
        };

        const handler = (event: MouseEvent) => {
            updateMouse(event);
        };

        mouseHandlerRef.current = handler;

        window.addEventListener("mousemove", handler);

        // create temp connection once
        pinConnection({
            id: "TempConnection",
            caseId: caseId,
            startId: id,
            endId: null,
            cursorPos: point,
            pos1: point,
        });
    };

    if (parentRef.current) {
        boardRect = parentRef.current.getBoundingClientRect();
    }

    const updateMouse = (e: MouseEvent) => {
        if (!connectionStateRef.current) return;

        const mouse = {
            x: e.clientX - boardRect.left,
            y: e.clientY - boardRect.top,
        };

        connectionStateRef.current = {
            ...connectionStateRef.current,
            mouse,
        };

        renewConnection({
            id: "TempConnection",
            changes: {
                cursorPos: mouse,
            },
        });
    };

    const endConnection = (
        targetId?: string,
        point?: { x: number; y: number },
        caseId?: string,
    ) => {
        const current = connectionStateRef.current;
        if (!current) return;

        if (mouseHandlerRef.current) {
            window.removeEventListener("mousemove", mouseHandlerRef.current);
        }

        unpinConnection("TempConnection");

        if (current.startId && targetId && caseId) {
            // 🔴 Prevent self-connection
            if (current.startId === targetId) {
                console.log("Cannot connect a clue to itself");
                connectionStateRef.current = null;
                console.log("Connection ended");
                return;
            }

            // 🔍 Check duplicate (undirected)
            const exists = allConnections.some(
                (conn) =>
                    conn.caseId === caseId &&
                    ((conn.startId === current.startId &&
                        conn.endId === targetId) ||
                        (conn.startId === targetId &&
                            conn.endId === current.startId)),
            );

            if (exists) {
                console.log("Connection already exists");
            } else {
                connectionRef.current = {
                    ...(connectionRef.current as Connection),
                    endId: targetId,
                    pos2: point,
                };

                pinConnection(connectionRef.current);
            }
        }

        connectionStateRef.current = null;
        connectionRef.current = null;
        console.log("Connection ended");
    };


    const [droppables, setDroppables] = useState<Droppable>(new Map());

    const registerDroppable = (
        id: string,
        ref: RefObject<HTMLElement | null>,
        onEnter?: (...args: any[]) => void,
        onLeave?: (...args: any[]) => void,
        onDrop?: (...args: any[]) => void,
    ) => {
        setDroppables((prev) =>
            new Map(prev).set(id, { ref, onEnter, onLeave, onDrop }),
        );
    };

    const unregisterDroppable = (id: string) => {
        setDroppables((prev) => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        });
    };


    const [dragOrder, setDrag] = useState<Array<string | null>>([]);

    const setDragOrder = (id: string) => {
        setDrag((prev) => {
            const filtered = prev.filter((item) => item !== id);
            return [...filtered, id];
        });
    };


    const [isModalActive, setModal] = useState<boolean>(false);

    const contextValue: DragState = {
        activeDrag,
        setActiveDrag,

        droppables,
        registerDroppable,
        unregisterDroppable,

        connectionState: connectionStateRef.current,
        startConnection,
        updateMouse,
        endConnection,

        dragOrder,
        setDragOrder,

        isModalActive,
        setModal,
    };

    return (
        <DragContext.Provider value={contextValue}>
            {children}
        </DragContext.Provider>
    );
}
