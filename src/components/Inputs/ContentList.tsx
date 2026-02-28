import React, { useState, useRef, useMemo} from "react";
import ContentBlock from "./ContentBlock";

import type { Clue } from "../../types/clues";
import { useCluesForClue } from "../../custom_hooks/useClueSelectors";

import { useMedia } from "../../custom_hooks/useMediaSelectors";

type ContentListProps = {
    clue?: Clue;
};

export default function ContentList({ clue }: ContentListProps) {
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

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
        // setPlaceholderIndex(index);
    };

    const handleDragEnd = () => {
        if (
            draggedIndex !== null &&
            placeholderIndex !== null &&
            draggedIndex !== placeholderIndex
        ) {
            const updated = [...(clue?.mediaIds as Array<string>)];
            if (placeholderIndex < clue!.mediaIds!.length) {
                const placeholder = updated[placeholderIndex];
                updated[placeholderIndex] = updated[draggedIndex];
                updated[draggedIndex] = placeholder;
            } else {
                const placeholder = updated[placeholderIndex - 1];
                updated[placeholderIndex - 1] = updated[draggedIndex];
                updated[draggedIndex] = placeholder;
            }
            renewClue({ mediaIds: updated });
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
                        type={item.type}
                        index={index}
                        movePlaceholder={movePlaceholder}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    ></ContentBlock>
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
