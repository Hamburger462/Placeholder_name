import { useState, useEffect } from "react";
import { useCluesForClue } from "./useClueSelectors";

export function useDrag(clueId: string) {
  const { clue, changePos } = useCluesForClue(clueId);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - clue.position.x,
      y: e.clientY - clue.position.y
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    // Optionally update transform for smooth movement
    setOffset(prev => ({
      ...prev,
      x: e.clientX - clue.position.x,
      y: e.clientY - clue.position.y
    }));
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    // Commit new position to Redux
    changePos(e.clientX - offset.x, e.clientY - offset.y);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, offset]);

  return { onMouseDown };
}
