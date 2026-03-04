import React, { useState, useRef, useMemo, useContext } from "react";
import { DragContext } from "../../context/dragContext";

import type { Clue } from "../../types/clues";
import { useCluesForClue } from "../../custom_hooks/useClueSelectors";

import { useMedia } from "../../custom_hooks/useMediaSelectors";
import ContentBlock from "./ContentBlock";

type ContentListProps = {
    clue?: Clue;
};

export default function ContentList({ clue }: ContentListProps) {
    const context = useContext(DragContext);

    const { allMediaEntities } = useMedia();

    const items = useMemo(() => {
        if (!clue?.mediaIds) return [];
        return clue.mediaIds.map((id) => allMediaEntities[id]).filter(Boolean);
    }, [clue?.mediaIds, allMediaEntities]);

    const { renewClue } = useCluesForClue(clue ? clue.id : "");

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(
        null,
    );

    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (index: number, id: string) => {
        setDraggedIndex(index);
        if (!clue?.mediaIds) return;
        context?.setActiveContent(id);
    };

    const handleDragEnd = () => {
        if (
            draggedIndex !== null &&
            placeholderIndex !== null &&
            draggedIndex !== placeholderIndex
        ) {
            const updated = [...(clue?.mediaIds ?? [])];

            const [movedItem] = updated.splice(draggedIndex, 1);

            const insertIndex =
                draggedIndex < placeholderIndex
                    ? placeholderIndex - 1
                    : placeholderIndex;

            updated.splice(insertIndex, 0, movedItem);

            renewClue({ mediaIds: updated });
        }
        setDraggedIndex(null);
        setPlaceholderIndex(null);
        context?.setActiveContent(null);
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

        if (draggedIndex - hoverIndex >= 1) {
            if (clientY < upperMiddle) {
                setPlaceholderIndex(hoverIndex);
                return;
            }
        }

        if (draggedIndex - hoverIndex <= 0) {
            if (clientY > bottomMiddle) {
                setPlaceholderIndex(hoverIndex + 1);
            }
        }
    };

    return (
        <div ref={containerRef}>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    {placeholderIndex !== null && context?.activeContent ? (
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
                        type={item.type}
                        index={index}
                        movePlaceholder={movePlaceholder}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        // onDragLeave={handleDragLeave}
                        // isDragging={draggedIndex === index}
                    ></ContentBlock>
                </React.Fragment>
            ))}
            {placeholderIndex && context?.activeContent ? (
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
