import { useState, useRef } from "react";
import type { RefObject } from "react";
import { DragContext } from "./dragContext";
import type { DragState, Droppable, ActiveElem } from "./dragContext";

export function DragProvider({ children }: { children: React.ReactNode }) {
    const [droppables, setDroppables] = useState<Droppable>(new Map());
    const [activeDrag, setActiveDrag] = useState<ActiveElem>(null);
    const activeDrop = useRef<ActiveElem>(null);

    const setActiveDrop = (drop: {id: string, ref: RefObject<HTMLElement | null>}) => {
        const newDrop: ActiveElem = drop;
        activeDrop.current = newDrop;
    };

    const registerDroppable = (
        id: string,
        ref: RefObject<HTMLElement | null>,
        onEnter?: (...args: any[]) => void,
        onLeave?: (...args: any[]) => void,
        onDrop?: (...args: any[]) => void
    ) => {
        setDroppables((prev) => new Map(prev).set(id, { ref, onEnter, onLeave, onDrop }));
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

        activeDrop: activeDrop.current,
        setActiveDrop,
    };

    return (
        <DragContext.Provider value={contextValue}>
            {children}
        </DragContext.Provider>
    );
}
