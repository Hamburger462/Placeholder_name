import { useRef, useEffect } from "react";

type DroppableProps = {
  onEnter?: () => void;
  onLeave?: () => void;
  children: React.ReactNode;
};

export default function Droppable({ onEnter, onLeave, children }: DroppableProps) {
  const dropRef = useRef<HTMLDivElement | null>(null);

  // expose the ref to parent if needed later
  return (
    <div
      ref={dropRef}
      style={{
        position: "relative",
        border: "2px dashed gray",
      }}
    >
      {children}
    </div>
  );
}
