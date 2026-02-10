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

export function DragProvider({ children }: { children: React.ReactNode }) {
    const [droppables, setDroppables] = useState<Droppable>(new Map());
    const [activeDrag, setActiveDrag] = useState<ActiveElem>(null);

    const ConnectionState = useRef<ConnectionState | null>(null);
    const {allConnections, pinConnection, unpinConnection, renewConnection} = useConnections()

    const startConnection = (id: string, point: { x: number; y: number }) => {
        console.log("Connection started")

        const newConnection: ConnectionState = {
            ...ConnectionState.current,
            isActive: true,
            startId: id,
            startPoint: point,
        };

        ConnectionState.current = newConnection;
    };

    const updateMouse = (point: { x: number; y: number }) => {
        const newConnection: ConnectionState = {
            ...ConnectionState.current,
            mouse: point,
        };

        ConnectionState.current = newConnection;
    };

    const endConnection = (targetId?: string, caseId?: string) => {
        console.log("Connection ended")

        const newConnection: Connection = {
            id: crypto.randomUUID(),
            caseId: caseId,
            startId: ConnectionState.current?.startId,
            endId: targetId
        }

        ConnectionState.current = null;

        pinConnection(newConnection);
    };

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

    const contextValue: DragState = {
        activeDrag,
        setActiveDrag,

        droppables,
        registerDroppable,
        unregisterDroppable,

        ConnectionState: ConnectionState.current,
        startConnection,
        updateMouse,
        endConnection,
    };

    return (
        <DragContext.Provider value={contextValue}>
            {children}
        </DragContext.Provider>
    );
}
