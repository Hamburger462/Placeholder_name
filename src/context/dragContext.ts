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

export type DragState = {
    activeDrag: ActiveElem;
    setActiveDrag: (drag: {
        id: string;
        ref: RefObject<HTMLElement | null>;
    } | null) => void;

    droppables: Droppable;
    registerDroppable: (
        id: string,
        ref: RefObject<HTMLElement | null>,
        onEnter?: (...args: any[]) => void | null,
        onLeave?: (...args: any[]) => void | null,
        onDrop?: (...args: any[]) => void | null,
    ) => void;
    unregisterDroppable: (id: string) => void;

    // activeDrop: ActiveElem;
    // setActiveDrop: (drop: {
    //     id: string;
    //     ref: RefObject<HTMLElement | null>;
    // } | null) => void;
};

export const DragContext = createContext<DragState | null>(null);
