import { DragContext } from "../context/dragContext";
import { useContext, useState, useEffect } from "react";

import { useCluesForClue } from "../custom_hooks/useClueSelectors";
import { useConnectionsForClue } from "../custom_hooks/useConnectionSelector";

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

import { type MediaItem } from "../types/clues";
import { useMedia } from "../custom_hooks/useMediaSelectors";

import ContentList from "./Inputs/ContentList";
import TextInput from "./Inputs/TextInput";
import DeleteContentBlock from "./Inputs/DeleteContentBlock";

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

    const { pinMedia } = useMedia();

    const { clue, renewClue } = useCluesForClue(context!.activeClue ?? "");
    const {connectionsByClueId} = useConnectionsForClue(context!.activeClue ?? "");

    const [title, setTitle] = useState<string | undefined>("");
    const [media, setMedia] = useState<Array<string>>([]);
    const [activeConnection, setActiveConnection] = useState<string | null>(null);

    useEffect(() => {
        if (!clue) return;

        setTitle(clue.title);
        setMedia(clue.mediaIds ? clue.mediaIds : []);
    }, [context.activeClue]);

    const saveClueChanges = () => {
        renewClue({
            title: title,
        });

        context.setActiveClue(null);
    };

    const addMediaItem = () => {
        if (!clue) return;

        const newMedia: MediaItem = {
            id: crypto.randomUUID(),
            clueId: clue.id,
            type: "",
        };

        pinMedia(newMedia);

        const updatedMedia = [...(media ?? []), newMedia.id];

        setMedia(updatedMedia);

        renewClue({ mediaIds: updatedMedia });
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
                        justifyContent: "space-between",
                        // width: "80%",
                        height: "100%",
                        maxHeight: "none",
                        maxWidth: "none",
                        margin: "0",
                        padding: "1%",
                        backgroundColor: "rgb(237, 216, 168, 0)",
                    },
                },
            }}
        >
            {activeConnection ? 
            <Container sx={{width: "30vw"}}></Container>
            : null
            }

            <Container sx={{width: "40vw", display: "flex", gap: "5%",}}>
                <Container
                disableGutters
                sx={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Paper>
                    <DialogActions>
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
                    </DialogActions>
                    <DialogActions sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        {connectionsByClueId ? connectionsByClueId.map(value => (<Button onClick={() => setActiveConnection((value.startId == clue.id ? value.endId : value.startId) as string)}>{value.startId == clue.id ? value.endId : value.startId}</Button>)) : null}
                    </DialogActions>
                    {/* <DialogActions>
                        <Button sx={{
                            color: "black",
                            fontWeight: 500,
                            width: "100%",
                        }} onClick={saveClueChanges}>Save changes</Button>
                        <Button onClick={() => context.setActiveClue(null)}>
                            Close
                        </Button>
                    </DialogActions> */}
                </Paper>

                <DeleteContentBlock></DeleteContentBlock>
                </Container>

                <Paper sx={{ flex: "4", padding: "10px", overflowY: "auto" }}>
                <TextInput
                    content={title}
                    setContent={setTitle}
                    name="Title"
                    className="ModalTitle"
                ></TextInput>
                <ContentList clue={clue ? clue : undefined}></ContentList>
                </Paper>
            </Container>
        </Dialog>
    );
}
