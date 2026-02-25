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
    Paper,
    Container,
    Button,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";

import TextInput from "./Inputs/TextInput";
import TextContentBlock from "./Inputs/TextContentBlock";
import ContentBlock from "./Inputs/ContentBlock";

import { type MediaItem } from "../types/clues";
import { useMedia } from "../custom_hooks/useMediaSelectors";

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
    const [media, setMedia] = useState<Array<MediaItem> | undefined>([]);

    if (!context) return null;

    const { allMedia, pinMedia, unpinMedia, renewMedia } = useMedia();
    const { clue, renewClue } = useCluesForClue(context!.activeClue ?? "");
    const clueMedia = clue ? allMedia.filter((value) => value.clueId == clue.id): [];

    useEffect(() => {
        if (!clue) return;

        setTitle(clue.title);
        setMedia(clueMedia);
    }, [context.activeClue]);

    const saveClueChanges = () => {
        renewClue({
            title: title,
        });

        context.setActiveClue(null);
    };

    const addMediaItem = () => {
        const newMedia: MediaItem = {
            id: crypto.randomUUID(),
            clueId: clue.id,
            type: "text",
            text: "",
        };

        pinMedia(newMedia);
    };

    return (
        <Dialog
            open={Boolean(context.activeClue)}
            onClose={saveClueChanges}
            slots={{
                transition: Transition,
            }}
            keepMounted
            disableRestoreFocus
            slotProps={{
                container: {
                    sx: {
                        justifyContent: "flex-end",
                        padding: "2%",
                    },
                },
                paper: {
                    sx: {
                        display: "flex",
                        flexDirection: "row",
                        width: "40%",
                        height: "100%",
                        gap: "5%",
                        maxHeight: "none",
                        margin: "0",
                        padding: "1%",
                        backgroundColor: "rgb(237, 216, 168)",
                    },
                },
            }}
        >
            <Container sx={{ flex: "1", padding: 0 }}>
                <Paper>
                    <Button
                        sx={{
                            color: "black",
                            fontWeight: 600,
                            width: "100%",
                        }}
                        onClick={addMediaItem}
                    >
                        Add content
                    </Button>
                    <DialogActions>
                        <Button onClick={saveClueChanges}>Save</Button>
                        <Button onClick={() => context.setActiveClue(null)}>
                            Close
                        </Button>
                    </DialogActions>
                </Paper>
            </Container>
            <Paper sx={{ flex: "4", padding: "10px" }}>
                <TextInput
                    content={title}
                    setContent={setTitle}
                    name="Title"
                    className="ModalTitle"
                ></TextInput>
                {clueMedia.map((value, index) => (
                    <ContentBlock key={value.id}></ContentBlock>
                ))}
            </Paper>
        </Dialog>
    );
}
