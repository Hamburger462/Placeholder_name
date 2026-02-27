import React from "react";

type ContentBlockProps = {
    id: string;
    index: number;
    movePlaceholder: (hoverIndex: number, clientY: number) => void;
    onDragStart: (index: number) => void;
    onDragEnd: () => void;
    onDragLeave?: () => void;
    children?: React.ReactNode;
};

export default function ContentBlock({
    id,
    index,
    movePlaceholder,
    onDragStart,
    onDragEnd,
    onDragLeave,
    children
}: ContentBlockProps) {

    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => {
                e.preventDefault();
                movePlaceholder(index, e.clientY);
            }}
            onDragLeave={onDragLeave}
            style={{
                padding: "12px",
                border: "1px solid #aaa",
                background: "white",
                marginBottom: "6px",
                cursor: "grab"
            }}
        >
            <div style={{ fontSize: 12, opacity: 0.5 }}>Grab me</div>
            {children}
        </div>
    );
}