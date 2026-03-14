import { useContext } from "react";
import { DragContext } from "../../context/dragContext";
import { authContext } from "../../context/authContext";

import { db } from "../../database/firebase";
import { doc, deleteDoc } from "firebase/firestore";

import { useMedia } from "../../custom_hooks/useMediaSelectors";
import { useCluesForClue } from "../../custom_hooks/useClueSelectors";

import { Container } from "@mui/material";

export default function DeleteContentBlock() {
    const context = useContext(DragContext);
    const userContext = useContext(authContext);

    const { unpinMedia } = useMedia();
    const { clue, renewClue } = useCluesForClue(context?.activeClue ?? "");

    const handleContentDelete = async (
        event: React.DragEvent<HTMLDivElement>,
    ) => {
        event.preventDefault();

        if (!context?.activeContent) return;

        unpinMedia(context.activeContent);

        if (!userContext?.activeCase) return;

        const updatedMediaIds = (clue.mediaIds ?? []).filter(
            (id) => id !== context.activeContent,
        );

        renewClue({
            mediaIds: updatedMediaIds,
        });

        if(!context.activeClue) return;

        await deleteDoc(
            doc(
                db,
                "Cases",
                userContext.activeCase,
                "Clues",
                context.activeClue,
                "Media",
                context.activeContent,
            ),
        );

        context.setActiveContent(null);
    };

    return (
        <Container
            sx={{
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "600",
                border: "2px dotted",
            }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                e.preventDefault()
            }
            onDrop={(event) => handleContentDelete(event)}
        >
            Delete zone
        </Container>
    );
}
