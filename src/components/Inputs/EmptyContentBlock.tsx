import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

import { useContext } from "react";
import { authContext } from "../../context/authContext";

import { db } from "../../database/firebase";
import { doc, updateDoc } from "firebase/firestore";

import { Button } from "@mui/material";

type EmptyContentProps = {
    id: string;
    clueId: string;
};

export default function EmptyContentBlock({ id, clueId }: EmptyContentProps) {
    const userContext = useContext(authContext);

    const { renewMedia } = useMediaForMedia(id);

    const setMediaType = async (type: string) => {
        switch (type) {
            case "text":
                renewMedia({ type: type });
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

        await updateDoc(doc(db, "Cases", userContext?.activeCase, "Clues", clueId, "Media", id), {
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
