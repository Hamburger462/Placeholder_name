import { DragContext } from "../context/dragContext";
import { useContext, useState, useEffect } from "react";

import { useCluesForClue } from "../custom_hooks/useClueSelectors";

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Button,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";

import TextInput from "./Inputs/TextInput";

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

    const [title, setTitle] = useState<string | undefined>("");

    if (!context) return null;

    const { clue, renewClue } = useCluesForClue(context!.activeClue ?? "");

    useEffect(() => {
        if (!clue) return;
        setTitle(clue.title);
    }, [clue]);

    const saveClueChanges = () => {
        renewClue({
            title: title,
        });

        context.setActiveClue(null);
    };

    return (
        <Dialog
            open={Boolean(context.activeClue)}
            onClose={() => context.setActiveClue(null)}
            slots={{
                transition: Transition,
            }}
            keepMounted
            disableRestoreFocus
            maxWidth={false}
            slotProps={{
                container: {
                    sx: {
                        justifyContent: "flex-end"
                    }
                },
                paper: {
                    sx: {
                        width: "30%",
                        height: "100%",
                    },
                },
            }}
        >
            <TextInput content={title} setContent={setTitle}></TextInput>
            <DialogActions>
                <Button onClick={() => context.setActiveClue(null)}>
                    Close
                </Button>
                <Button onClick={() => saveClueChanges}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
