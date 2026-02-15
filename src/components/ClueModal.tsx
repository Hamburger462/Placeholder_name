import { DragContext } from "../context/dragContext";
import { useContext } from "react";
import { createPortal } from "react-dom";

// type ClueModalProps = {
//     children?: React.ReactNode;
// };

export default function ClueModal() {
    const context = useContext(DragContext);

    // ADD MODAL WINDOW TO SEE AND EDIT CLUES AND ITS DATA
    // FIX SOME ANIMATIONS MAYBE

    if(!context?.isModalActive) return null;

    return createPortal(
        <div className="ClueModal" >
            <div></div>
        </div>
        , document.body);
}
