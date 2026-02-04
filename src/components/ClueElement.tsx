import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useDrag } from "../custom_hooks/useDrag";

export default function ClueItem({ clueId }: { clueId: string }) {
  const { clue } = useCluesForClue(clueId);
  const { onMouseDown } = useDrag(clueId);

  return (
    <div className="ClueElement"
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: clue.position.x,
        top: clue.position.y,
        cursor: "grab"
      }}
    >
      {clue.title}
    </div>
  );
}
