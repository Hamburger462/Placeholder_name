import type { RefObject } from "react";
import Draggable from "./Draggable";
import { useContext, useEffect } from "react";
import { DragContext } from "../context/dragContext";

interface ConnectionItemProps {
    parentRef: RefObject<HTMLDivElement | null>
    onConnectionStart?: (...args: any[]) => void;
    onConnectionEnd?: (...args: any[]) => void;
}

export default function ConnectionItem({parentRef, onConnectionStart, onConnectionEnd}: ConnectionItemProps){
    const context = useContext(DragContext);

    return (<>
        <Draggable onDragEnd={onConnectionEnd} parentRef={parentRef} initialX={0} initialY={0}>
            <div>This is connection</div>
        </Draggable>
        </>)
}