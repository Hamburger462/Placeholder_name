import { createContext } from "react";

export type DragState = {
  activeId: string | null;
  rect: DOMRect | null;
  setDragState: (state: { activeId: string | null; rect: DOMRect | null }) => void;
};

export const DragContext = createContext<DragState | null>(null);
