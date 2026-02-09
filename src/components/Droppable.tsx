import { useRef, useEffect, useContext, type RefObject} from "react";
import { DragContext } from "../context/dragContext";

export type DroppableProps = {
  id: string;
  onEnter?: (...args: any[]) => void;
  onLeave?: (...args: any[]) => void;
  onDrop?: (...args: any[]) => void;
  onMouseDown?: (...args: any[]) => void;
  onMouseUp?: (...args: any[]) => void;
  children?: React.ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function Droppable({ id, ref = useRef<HTMLDivElement | null>(null), children, className, onEnter, onLeave, onDrop, onMouseDown, onMouseUp}: DroppableProps) {
  const context = useContext(DragContext);
  useEffect(() => {
    if(ref.current){
      context?.registerDroppable(id, ref, onEnter, onLeave, onDrop)
    }
    return () => context?.unregisterDroppable(id);
  }, []);


  // expose the ref to parent if needed later
  return (
    <div
      className={className}
      ref={ref}
      style={{
        border: "2px dashed gray",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  );
}
