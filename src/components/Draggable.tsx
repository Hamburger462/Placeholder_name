import { useState, useRef, useEffect } from "react";
// import { useContext } from "react";
// import { DragContext } from "../context/dragContext";

type DraggableProps = {
  children: React.ReactNode;
  initialX: number;
  initialY: number;
  onDragEnd?: (x: number, y: number) => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
};

export default function Draggable({
  children,
  initialX,
  initialY,
  onDragEnd,
  parentRef
}: DraggableProps) {
  const [isDragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: initialX, y: initialY });

  const offset = useRef({ x: 0, y: 0 });

  const dragRef = useRef<HTMLDivElement>(null);


  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);

    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !parentRef.current || !dragRef.current) return;

  const parentRect = parentRef.current.getBoundingClientRect();
  const dragRect = dragRef.current.getBoundingClientRect();

  let newX = e.clientX - offset.current.x;
  let newY = e.clientY - offset.current.y;


  // Clamp horizontally
  newX = Math.max(0, Math.min(newX, parentRect.width - dragRect.width));

  // Clamp vertically
  newY = Math.max(0, Math.min(newY, parentRect.height - dragRect.height));

  setPos({ x: newX, y: newY });
};


  const onMouseUp = () => {
    if (!isDragging) return;

    setDragging(false);
    onDragEnd?.(pos.x, pos.y); // use committed position
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
  }, [isDragging]);

  return (
    <div
        ref={dragRef}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
