import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useCluesForCase } from "../custom_hooks/useClueSelectors";
import "./ClueElement.css";
import Draggable from "./Draggable";
import type { DraggableProps } from "./Draggable";

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

      console.log(droppedId)
    };

    return (
        <Draggable
            onDragEnd={HandleClueDrop}
            initialX={drag_data.initialX}
            initialY={drag_data.initialY}
            parentRef={drag_data.parentRef}
            className="ClueElement"
        >
            <div>Title: {clue.title}</div>
        </Draggable>
    );
}
