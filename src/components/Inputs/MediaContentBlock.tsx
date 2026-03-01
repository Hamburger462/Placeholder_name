import { Button } from "@mui/material";

import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

type MediaContentProps = {
    id: string;
};

export default function MediaContentBlock({ id }: MediaContentProps) {
    const { mediaForMedia } = useMediaForMedia(id);

    const acceptMap: Record<string, string> = {
        image: "image/*",
        video: "video/*",
        audio: "audio/*",
    };

    const acceptValue = acceptMap[mediaForMedia.type] ?? "";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith(mediaForMedia.type)) {
            console.error("Invalid file type");
            return;
        }

        // proceed
    };

    return (
        <div>
            {mediaForMedia.type == "image" && <div>This is an image</div>}
            {mediaForMedia.type == "video" && <div>This is a video</div>}
            {mediaForMedia.type == "audio" && <div>This is an audio</div>}

            <Button variant="contained" component="label">
                Upload
                <input
                    hidden
                    type="file"
                    accept={acceptValue}
                    onChange={handleFileChange}
                />
            </Button>
        </div>
    );
}
