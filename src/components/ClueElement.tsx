import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import "./ClueElement.css"
import Draggable from "./Draggable";
import type { DraggableProps } from "./Draggable";

export interface ClueProps {
  clueId: string
}

export interface ClueItemProps {
  clue_data: ClueProps,
  drag_data: DraggableProps
}

export default function ClueItem({clue_data, drag_data}: ClueItemProps) {
  const { clue } = useCluesForClue(clue_data.clueId);

  return (
    <Draggable initialX={drag_data.initialX} initialY={drag_data.initialY} parentRef={drag_data.parentRef} className="ClueElement">
      <span>{clue.title}</span>
    </Draggable>
  );
}
