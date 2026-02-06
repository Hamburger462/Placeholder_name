import { useRef, useEffect, useContext } from "react";
import { DragContext } from "../context/dragContext";
import type { ActiveElem } from "../context/dragContext";

export type DroppableProps = {
  id: string;
  onEnter?: (...args: any[]) => void;
  onLeave?: (...args: any[]) => void;
  children?: React.ReactNode;
  className?: string
};

export default function Droppable({ id, onEnter, onLeave, children, className}: DroppableProps) {
  const dropRef = useRef<HTMLDivElement | null>(null);

  const context = useContext(DragContext);

  useEffect(() => {
    if(dropRef.current){
      context?.registerDroppable(id, dropRef)
    }
    return () => context?.unregisterDroppable(id);
  }, []);


  // expose the ref to parent if needed later
  return (
    <div
      className={className}
      ref={dropRef}
      style={{
        border: "2px dashed gray",
      }}
    >
      {children}
    </div>
  );
}
