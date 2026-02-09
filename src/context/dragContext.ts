import { createContext } from "react";
import type { RefObject } from "react";

export type Droppable = Map<
    string,
    {
        ref: RefObject<HTMLElement | null>;
        onEnter?: (...args: any[]) => void | null;
        onLeave?: (...args: any[]) => void | null;
        onDrop?: (...args: any[]) => void | null;
    }
>;

export type ActiveElem = {
    id: string;
    ref: RefObject<HTMLElement | null>;
} | null;

export type ConnectionState = {
    isActive?: boolean;
    startId?: string | null;
    startPoint?: { x: number; y: number } | null;
    mouse?: { x: number; y: number };
};

export interface DragState {
    activeDrag: ActiveElem;
    setActiveDrag: (
        drag: {
            id: string;
            ref: RefObject<HTMLElement | null>;
        } | null,
    ) => void;

    droppables: Droppable;
    registerDroppable: (
        id: string,
        ref: RefObject<HTMLElement | null>,
        onEnter?: (...args: any[]) => void | null,
        onLeave?: (...args: any[]) => void | null,
        onDrop?: (...args: any[]) => void | null,
    ) => void;
    unregisterDroppable: (id: string) => void;

    ConnectionState: ConnectionState | null;
    startConnection: (id: string, point: { x: number; y: number }) => any;
    updateMouse: (point: { x: number; y: number }) => any;
    endConnection: (targetId?: string, caseId?: string) => any;

    // activeDrop: ActiveElem;
    // setActiveDrop: (drop: {
    //     id: string;
    //     ref: RefObject<HTMLElement | null>;
    // } | null) => void;
};

export const DragContext = createContext<DragState | null>(null);
