import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import "./ClueElement.css"

export default function ClueItem({ clueId }: { clueId: string }) {
  const { clue } = useCluesForClue(clueId);

  return (
    <div className="ClueElement">
      {clue.title}
    </div>
  );
}
