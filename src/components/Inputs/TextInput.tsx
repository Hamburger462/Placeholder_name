import Quill from "quill";
import "quill/dist/quill.snow.css";

import { useRef, useEffect } from "react";

type TextInputProps = {
    content: any;
    setContent: React.Dispatch<any>;
};

export default function TextInput({ content, setContent }: TextInputProps) {
    const inputRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill>(null);

    useEffect(() => {
        if (!inputRef.current) return;

        // Clear container in case it has leftover DOM (important in Dialogs)
        inputRef.current.innerHTML = "";

        const quill = new Quill(inputRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    ["clean"],
                ],
            },
        });

        quillRef.current = quill;

        // Optionally set initial content
        if (content) {
            quill.setText(content);
        }

        const handler = () => {
            setContent(quill.getText());
        };

        quill.on("text-change", handler);

        return () => {
            quill.off("text-change", handler);
        };
    }, []);

    return (
        <>
            <div ref={inputRef} style={{ minHeight: 200 }} />
        </>
    );
}
