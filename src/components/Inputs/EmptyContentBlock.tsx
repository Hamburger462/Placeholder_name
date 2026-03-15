import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

import { Button } from "@mui/material";

type EmptyContentProps = {
    id: string;
};

export default function EmptyContentBlock({ id }: EmptyContentProps) {
    const { renewMedia } = useMediaForMedia(id);

    const setMediaType = (type: string) => {
        switch (type) {
            case "text":
                renewMedia({ type: type, text: "" });
                break;
            case "image":
                renewMedia({ type: type, url: ""});
                break;
            case "video":
                renewMedia({ type: type, url: ""});
                break;
            case "audio":
                renewMedia({ type: type, url: ""});
                break;
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around"
        }}>
            <Button onClick={() => setMediaType("text")}>Text</Button>
            <Button onClick={() => setMediaType("image")}>Image</Button>
            <Button onClick={() => setMediaType("video")}>Video</Button>
            <Button onClick={() => setMediaType("audio")}>Audio</Button>
        </div>
    );
}
