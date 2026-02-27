import React, { useState, useRef, useEffect } from "react";
import ContentBlock from "./ContentBlock";

type Item = {
    id: string;
    content: string;
};

export default function ContentList() {
    const [items, setItems] = useState<Item[]>([
        { id: "1", content: "Block 1" },
        { id: "2", content: "Block 2" },
        { id: "3", content: "Block 3" },
        { id: "4", content: "Block 4" },
    ]);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(
        null,
    );

    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
        // setPlaceholderIndex(index);
    };

    useEffect(() => {
        console.log(placeholderIndex);
    }, [placeholderIndex]);

    const handleDragEnd = () => {
        if (
            draggedIndex !== null &&
            placeholderIndex !== null &&
            draggedIndex !== placeholderIndex
        ) {
            const updated = [...items];
            if (placeholderIndex < items.length) {
                const placeholder = updated[placeholderIndex];
                updated[placeholderIndex] = updated[draggedIndex];
                updated[draggedIndex] = placeholder;
            } else {
                const placeholder = updated[placeholderIndex - 1];
                updated[placeholderIndex - 1] = updated[draggedIndex];
                updated[draggedIndex] = placeholder;
            }
            setItems(updated);
        }

        setDraggedIndex(null);
        setPlaceholderIndex(null);
    };

    const movePlaceholder = (hoverIndex: number, clientY: number) => {
        if (draggedIndex === null) return;
        if (draggedIndex === hoverIndex) {
            setPlaceholderIndex(draggedIndex);
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        const children = Array.from(container.children) as HTMLElement[];
        const hoveredEl = children[hoverIndex];

        if (!hoveredEl) return;

        const hoverRect = hoveredEl.getBoundingClientRect();
        const bottomMiddle = hoverRect.bottom - hoverRect.height / 3;
        const upperMiddle = hoverRect.top + hoverRect.height / 3;

        if (clientY > bottomMiddle) {
            console.log("bottom");
            setPlaceholderIndex(hoverIndex + 1);
        }

        if (hoverIndex - draggedIndex != 1)
            if (clientY < upperMiddle) {
                console.log("top");
                setPlaceholderIndex(hoverIndex);
            }
    };

    return (
        <div ref={containerRef}>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    {placeholderIndex !== null ? (
                        placeholderIndex == index &&
                        placeholderIndex !== draggedIndex ? (
                            <div
                                style={{
                                    height: "40px",
                                    border: "2px dotted blue",
                                    marginBottom: "6px",
                                }}
                            ></div>
                        ) : null
                    ) : null}

                    <ContentBlock
                        id={item.id}
                        index={index}
                        movePlaceholder={movePlaceholder}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {item.content}
                    </ContentBlock>
                </React.Fragment>
            ))}
            {placeholderIndex ? (
                placeholderIndex == items.length &&
                placeholderIndex !== draggedIndex ? (
                    <div
                        style={{
                            height: "40px",
                            border: "2px dotted blue",
                            marginBottom: "6px",
                        }}
                    ></div>
                ) : null
            ) : null}
        </div>
    );
}
