import { DragContext } from "../context/dragContext";
import { useContext } from "react";

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
    if (!context) return null;

    return (
        <Dialog
            open={context.isModalActive}
            onClose={() => context.setModal(false)}
            slots={{
                transition: Transition
            }}
            keepMounted
            disableRestoreFocus
        >
            <DialogTitle>Slide Dialog</DialogTitle>
            <DialogContent>This dialog slides in from the left.</DialogContent>
            <DialogActions>
                <Button onClick={() => context.setModal(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
