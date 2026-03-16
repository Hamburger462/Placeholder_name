import Quill, { Delta, type EmitterSource } from "quill";
import "quill/dist/quill.snow.css";

import { useRef, useEffect, useContext } from "react";
import { authContext } from "../../context/authContext";

import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

import { db } from "../../database/firebase";
import { doc, updateDoc } from "firebase/firestore";

type TextContentBlockProps = {
    id: string;
    clueId: string;
    isSingleLine?: boolean;
};

export default function TextContentBlock({
    id,
    clueId,
    isSingleLine,
}: TextContentBlockProps) {
    const userContext = useContext(authContext);

    const inputRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    const { mediaForMedia, renewMedia } = useMediaForMedia(id);

    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initialize Quill
    useEffect(() => {
        if (!inputRef.current) return;

        const quill = new Quill(inputRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    ["clean"],
                ],
            },
        });

        quillRef.current = quill;

        // Handle text changes
        const handler = (_: Delta, _1: Delta, source: EmitterSource) => {
            if (source !== "user") return;

            const delta = quill.getContents(); // get Delta object

            // Update local state
            renewMedia({ text: delta.ops });

            if (!userContext?.activeCase) return;

            // Debounce Firestore updates
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

            saveTimerRef.current = setTimeout(async () => {
                await updateDoc(
                    doc(
                        db,
                        "Cases",
                        userContext.activeCase,
                        "Clues",
                        clueId,
                        "Media",
                        id,
                    ),
                    { text: { ...delta } },
                );
            }, 500);
        };

        quill.on("text-change", handler);

        // Single-line mode (optional)
        if (isSingleLine) {
            quill.keyboard.addBinding({ key: 13 }, () => true); // prevent Enter
        }

        return () => {
            quill.off("text-change", handler);
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);

    if (mediaForMedia.type !== "text") return null;

    // Restore Delta from media
    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        // Only set contents if editor is empty
        if (quill.getLength() <= 1 && mediaForMedia.text) {
            quill.setContents(mediaForMedia.text);
        }
    }, [mediaForMedia]);

    return <div ref={inputRef} style={{ minHeight: 200 }} />;
}
