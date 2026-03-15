import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

import { useContext } from "react";
import { DragContext } from "../../context/dragContext";
import { authContext } from "../../context/authContext";

import { db } from "../../database/firebase";
import { doc, updateDoc } from "firebase/firestore";

import { Button } from "@mui/material";

type EmptyContentProps = {
    id: string;
};

export default function EmptyContentBlock({ id }: EmptyContentProps) {
    const context = useContext(DragContext);
    const userContext = useContext(authContext);

    const { renewMedia } = useMediaForMedia(id);

    const setMediaType = async (type: string) => {
        switch (type) {
            case "text":
                renewMedia({ type: type, text: "" });
                break;
            case "image":
                renewMedia({ type: type, url: "" });
                break;
            case "video":
                renewMedia({ type: type, url: "" });
                break;
            case "audio":
                renewMedia({ type: type, url: "" });
                break;
        }

        if(!userContext?.activeCase) return;
        if(!context?.activeClue) return;

        await updateDoc(doc(db, "Cases", userContext?.activeCase, "Clues", context?.activeClue, "Media", id), {
            type: type
        });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-around",
            }}
        >
            <Button onClick={() => setMediaType("text")}>Text</Button>
            <Button onClick={() => setMediaType("image")}>Image</Button>
            <Button onClick={() => setMediaType("video")}>Video</Button>
            <Button onClick={() => setMediaType("audio")}>Audio</Button>
        </div>
    );
}
