import { useState, useEffect, useContext } from "react";

import { DragContext } from "../../context/dragContext";
import { authContext } from "../../context/authContext";

import { Button } from "@mui/material";

import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

import { db } from "../../database/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { uploadFile } from "../../database/supabase";

type MediaContentProps = {
    id: string;
};

export default function MediaContentBlock({ id }: MediaContentProps) {
    const context = useContext(DragContext);
    const userContext = useContext(authContext);

    const { mediaForMedia } = useMediaForMedia(id);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const acceptMap: Record<string, string> = {
        image: "image/*",
        video: "video/*",
        audio: "audio/*",
    };

    const acceptValue = acceptMap[mediaForMedia.type] ?? "";

    useEffect(() => {
        async function setUrl(){
            if (!context?.activeClue) return;
            if (!userContext?.activeCase) return;

            const docRef = await getDoc(doc(db, "Cases", userContext?.activeCase, "Clues", context?.activeClue, "Media", mediaForMedia.id));
            setPreviewUrl((docRef.data()!.url) as string);
        }

        setUrl();
    }, [context?.activeClue])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // single file only
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith(mediaForMedia.type)) {
            console.error("Invalid file type");
            return;
        }

        setFile(selectedFile);

        // Generate preview for image/video
        if (mediaForMedia.type === "image" || mediaForMedia.type === "video") {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(null);
        }

        // Upload to Supabase
        setLoading(true);
        try {
            // Example file path: "clues/<mediaId>-filename.ext"
            const filePath = `clues/${mediaForMedia.id}-${selectedFile.name}`;
            const publicUrl = await uploadFile(selectedFile, filePath);
            console.log("Uploaded to Supabase:", publicUrl);

            if (!context?.activeClue) return;
            if (!userContext?.activeCase) return;

            await updateDoc(
                doc(
                    db,
                    "Cases",
                    userContext.activeCase,
                    "Clues",
                    context.activeClue,
                    "Media",
                    mediaForMedia.id,
                ),
                { url: publicUrl },
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {mediaForMedia.type === "image" && previewUrl && (
                <img
                    src={previewUrl}
                    alt="preview"
                    style={{ maxWidth: 300, marginBottom: 10 }}
                />
            )}
            {mediaForMedia.type === "video" && previewUrl && (
                <video
                    src={previewUrl}
                    controls
                    style={{ maxWidth: 300, marginBottom: 10 }}
                />
            )}
            {mediaForMedia.type === "audio" && file && (
                <audio controls src={URL.createObjectURL(file)} />
            )}

            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
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
