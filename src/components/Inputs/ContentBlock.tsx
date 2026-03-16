import EmptyContentBlock from "./EmptyContentBlock";
import TextContentBlock from "./TextContentBlock";
import MediaContentBlock from "./MediaContentBlock";

type ContentBlockProps = {
    id: string;
    type: string;
    index: number;
    clueId: string;

    movePlaceholder: (hoverIndex: number, clientY: number) => void;
    onDragStart: (index: number, id: string) => void;
    onDragEnd: () => void;
    isDragging?: boolean;

    // children?: React.ReactNode;
};

export default function ContentBlock({
    id,
    type,
    index,
    clueId,

    movePlaceholder,
    onDragStart,
    onDragEnd,

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
            // onDragLeave={() => onDragLeave(index)}
            style={{
                padding: "12px",
                border: "1px solid #aaa",
                background: "white",
                marginBottom: "6px",
                cursor: "grab",
            }}
        >

            {type === "" && <EmptyContentBlock clueId={clueId} id={id} />}
            {type === "text" && <TextContentBlock clueId={clueId} id={id} />}
            {(type === "image" ||
                type === "video" ||
                type === "audio") && (
                <MediaContentBlock clueId={clueId} id={id} />
            )}
        </div>
    );
}
