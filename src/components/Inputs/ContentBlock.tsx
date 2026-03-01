import EmptyContentBlock from "./EmptyContentBlock";
import TextContentBlock from "./TextContentBlock";
import MediaContentBlock from "./MediaContentBlock";

type ContentBlockProps = {
    id: string;
    type: string;
    index: number;

    movePlaceholder: (hoverIndex: number, clientY: number) => void;
    onDragStart: (index: number, id: string) => void;
    onDragEnd: () => void;
    onDragLeave: (index: number) => void;
    isDragging?: boolean;

    // children?: React.ReactNode;
};

export default function ContentBlock({
    id,
    type,
    index,

    movePlaceholder,
    onDragStart,
    onDragEnd,
    onDragLeave,
    isDragging,

    // children,
}: ContentBlockProps) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(index, id)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => {
                e.preventDefault();
                movePlaceholder(index, e.clientY);
            }}
            onDragLeave={() => onDragLeave(index)}
            style={{
                padding: "12px",
                border: "1px solid #aaa",
                background: "white",
                marginBottom: "6px",
                cursor: "grab",
                // opacity: isDragging ? 0.5 : 1,
            }}
        >

            {type === "" && <EmptyContentBlock id={id} />}
            {type === "text" && <TextContentBlock id={id} />}
            {(type === "image" ||
                type === "video" ||
                type === "audio") && (
                <MediaContentBlock id={id} />
            )}
        </div>
    );
}
