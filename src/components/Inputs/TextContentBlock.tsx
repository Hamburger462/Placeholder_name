import Quill, { Delta, type EmitterSource } from "quill";
import "quill/dist/quill.snow.css";

import { useRef, useEffect } from "react";

import { useMediaForMedia } from "../../custom_hooks/useMediaSelectors";

type TextContentBlockProps = {
    id: string;
    isSingleLine?: boolean;
};

export default function TextContentBlock({
    id,
    isSingleLine,
}: TextContentBlockProps) {
    const inputRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill>(null);

    const {mediaForMedia, renewMedia} = useMediaForMedia(id);

    useEffect(() => {
        if (!inputRef.current) return;

        const quill = new Quill(inputRef.current, {
            theme: "snow",
            modules: {
                // toolbar: [
                //     [{ header: [1, 2, false] }],
                //     ["bold", "italic", "underline"],
                //     ["link"],
                //     ["clean"],
                // ],
                toolbar: false,
            },
        });

        quillRef.current = quill;

        const handler = (_: Delta, _1: Delta, source: EmitterSource) => {
            if (source !== "user") return;

            const text = quill.getText();
            renewMedia({text: text});
        };

        quill.on("text-change", handler);

        if (isSingleLine) {
            quill.keyboard.addBinding({ key: 13 }, () =>
                console.log("New line"),
            );
        }

        return () => {
            quill.off("text-change", handler);
        };
    }, []);

    if(mediaForMedia.type != "text") return null;

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        const current = quill.getText();

        // Only update if different
        if (mediaForMedia.text !== current) {
            quill.setText(mediaForMedia.text || "");
        }
    }, [mediaForMedia]);


    return (
        <>
            <div ref={inputRef} style={{ minHeight: 200 }} />
        </>
    );
}
