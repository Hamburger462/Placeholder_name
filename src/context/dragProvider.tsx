import { useState } from "react";
import { DragContext } from "./dragContext";

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    activeId: string | null;
    rect: DOMRect | null;
  }>({
    activeId: null,
    rect: null,
  });

  return (
    <DragContext.Provider
      value={{
        activeId: state.activeId,
        rect: state.rect,
        setDragState: setState,
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
