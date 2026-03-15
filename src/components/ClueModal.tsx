import { DragContext } from "../context/dragContext";
import { authContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";

import { db } from "../database/firebase";
import { doc, setDoc } from "firebase/firestore";

import {
    useCluesForClue,
    useCluesForCase,
} from "../custom_hooks/useClueSelectors";
import { useConnectionsForClue } from "../custom_hooks/useConnectionSelector";

import React from "react";

import {
    Dialog,
    DialogTitle,
    // DialogContent,
    DialogActions,
    Slide,
    Paper,
    Container,
    Button,
} from "@mui/material";
import Box from "@mui/material/Box";
import { type TransitionProps } from "@mui/material/transitions";

import { type MediaItem } from "../types/clues";
import { useMedia } from "../custom_hooks/useMediaSelectors";

import ContentList from "./Inputs/ContentList";
import TextInput from "./Inputs/TextInput";
import DeleteContentBlock from "./Inputs/DeleteContentBlock";

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

    const { clue, renewClue: renewActiveClue } = useCluesForClue(
        context!.activeClue ?? "",
    );
    const { clueByClueIdInCase, renewClue } = useCluesForCase(
        clue ? clue.caseId : "",
    );

    const { connectionsByClueId } = useConnectionsForClue(
        context!.activeClue ?? "",
    );

    const [title, setTitle] = useState<string | undefined>("");
    const [media, setMedia] = useState<Array<string>>([]);

    const [activeConnection, setActiveConnection] = useState<string | null>(
        null,
    );
    const [connectedTitle, setConnectedTitle] = useState<string | undefined>(
        "",
    );
    const [_, setConnectedMedia] = useState<Array<string>>([]);

    useEffect(() => {
        if (!clue) return;

        setTitle(clue.title);
        setMedia(clue.mediaIds ? clue.mediaIds : []);
    }, [context.activeClue]);

    useEffect(() => {
        if (!activeConnection) return;

        const connectedClue = clueByClueIdInCase(activeConnection);
        setConnectedTitle(connectedClue?.title);
        setConnectedMedia(
            connectedClue?.mediaIds ? connectedClue.mediaIds : [],
        );
    }, [activeConnection]);

    const saveClueChanges = () => {
        renewActiveClue({
            title: title,
        });

        if (activeConnection) {
            renewClue({
                id: activeConnection,
                changes: { title: connectedTitle },
            });
        }

        context.setActiveClue(null);
        setActiveConnection(null);
    };

    const userContext = useContext(authContext);

    const addMediaItem = async () => {
        if (!clue) return;

        const newMedia: MediaItem = {
            id: crypto.randomUUID(),
            clueId: clue.id,
            type: "",
        };

        pinMedia(newMedia);

        const updatedMedia = [...(media ?? []), newMedia.id];

        setMedia(updatedMedia);

        renewActiveClue({ mediaIds: updatedMedia });

        if(!userContext?.activeCase) return;

        if(!context.activeClue) return;

        await setDoc(doc(db, "Cases", userContext.activeCase, "Clues", context.activeClue, "Media", newMedia.id), {
            type: newMedia.type,
            order: updatedMedia.length - 1
        });
    };

    const changeActiveConnection = (id: string) => {
        if (activeConnection == id) {
            setActiveConnection(null);
        } else {
            setActiveConnection(id);
        }
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
                        gap: "24px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // width: "80%",
                        height: "100%",
                        maxHeight: "none",
                        maxWidth: "none",
                        minWidth: "70%",
                        margin: "0",
                        padding: "1%",
                        backgroundColor: "rgb(237, 216, 168, 1)",
                    },
                },
            }}
        >
            <Paper
                sx={{
                    flexGrow: activeConnection ? 3 : 0,
                    flexBasis: 0,
                    transition: "flex-grow 300ms ease",
                    overflow: "hidden",
                    overflowY: activeConnection ? "auto" : "hidden",
                    padding: activeConnection ? "10px" : "0",
                }}
            >
                <TextInput
                    content={connectedTitle}
                    setContent={setConnectedTitle}
                    name="Title"
                    className="ModalTitle"
                ></TextInput>
                <ContentList
                    clue={
                        activeConnection
                            ? clueByClueIdInCase(activeConnection)
                            : undefined
                    }
                ></ContentList>
            </Paper>

            <Container
                disableGutters
                sx={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
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
                </Paper>

                <Paper>
                    <DeleteContentBlock></DeleteContentBlock>
                </Paper>

                {connectionsByClueId.length > 0 ? (
                    <Paper>
                        <DialogTitle>Connections</DialogTitle>
                        <DialogActions
                            disableSpacing
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            {connectionsByClueId.map((value) => {
                                const targetId = (
                                    value.startId == clue.id
                                        ? value.endId
                                        : value.startId
                                ) as string;

                                return (
                                    <Box
                                        key={targetId}
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {clueByClueIdInCase(targetId)?.title}
                                        <Button
                                            onClick={() =>
                                                changeActiveConnection(targetId)
                                            }
                                            variant="contained"
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                );
                            })}
                        </DialogActions>
                    </Paper>
                ) : null}
            </Container>

            <Paper sx={{ flex: "3", padding: "10px", overflowY: "auto" }}>
                <TextInput
                    content={title}
                    setContent={setTitle}
                    name="Title"
                    className="ModalTitle"
                ></TextInput>
                <ContentList clue={clue ? clue : undefined}></ContentList>
            </Paper>
        </Dialog>
    );
}
