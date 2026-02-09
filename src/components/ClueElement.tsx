import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";

import "./ClueElement.css";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import type { DraggableProps } from "./Draggable";

import { useRef } from "react";

import { type onDragEndPos } from "./Draggable";

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

    const HandleClueDrop = (
        dragPos: {
            x: number;
            y: number;
            setPos: React.Dispatch<
                React.SetStateAction<{ x: number; y: number }>
            >;
        },
        droppedId?: string | null,
    ) => {
      if(droppedId == "DEATHZONE"){
        unpinClue(clue.id);
      }
    };

    const ConnectionDropRef = useRef<HTMLDivElement | null>(null);
    const ConnectionDropPos = useRef<any>({x: drag_data.initialX, y: drag_data.initialY});

    const HandleDragConnection = (dragPos: onDragEndPos, droppedId?: string | null,) => {
        if(droppedId?.split("-")[0] == "ConnectionDrop"){
            console.log("Inside the connection drop");
        }
        else{
            dragPos.setPos(ConnectionDropPos.current);
        }
    }

    const updateConnection = () => {
        
    }

    return (
        <>
        <Draggable
            onDragEnd={HandleClueDrop}
            initialX={drag_data.initialX}
            initialY={drag_data.initialY}
            parentRef={drag_data.parentRef}
            className="ClueElement"
        >
            <Droppable ref={ConnectionDropRef} id={`ConnectionDrop-${clue.id}`} onLeave={() => ConnectionDropPos.current = {x: ConnectionDropRef.current?.getBoundingClientRect().x, y: ConnectionDropRef.current?.getBoundingClientRect().y}}>
                <div>Connectable here</div>
            </Droppable>
            <Draggable className="ConnectionElement" initialX={drag_data.initialX} initialY={drag_data.initialY} parentRef={drag_data.parentRef} onDragEnd={HandleDragConnection}>
            <div>Connection here</div>
        </Draggable>
            <div>Title: {clue.title}</div>
        </Draggable>
        </>
    );
}
