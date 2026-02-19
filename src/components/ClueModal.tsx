import { DragContext } from "../context/dragContext";
import { useContext, useEffect, useRef } from "react";

import { useCluesForClue } from "../custom_hooks/useClueSelectors";

import React from "react";

import {
    Dialog,
    DialogTitle,
    Slide,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import { type Clue } from "../types/clues";

// type ClueModalProps = {
//     children?: React.ReactNode;
// };

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function ClueModal() {
    const context = useContext(DragContext);
    const clueRef = useRef<Clue>(null);

    if (!context) return null;

    return (
        <Dialog
            open={Boolean(context.activeClue)}
            onClose={() => context.setActiveClue(null)}
            slots={{
                transition: Transition
            }}
            keepMounted
            disableRestoreFocus
        >
            <DialogTitle>{clueRef.current?.title}</DialogTitle>
            <DialogContent>This dialog slides in from the left.</DialogContent>
            <DialogActions>
                <Button onClick={() => context.setActiveClue(null)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
