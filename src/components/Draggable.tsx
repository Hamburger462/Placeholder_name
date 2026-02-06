import { useState, useRef, useEffect, useContext } from "react";
import { DragContext, type Droppable } from "../context/dragContext";

export type DraggableProps = {
    children?: React.ReactNode;
    initialX: number;
    initialY: number;
    onDragEnd?: (x: number, y: number) => void;
    parentRef: React.RefObject<HTMLDivElement | null>;
    className?: string,
};

export default function Draggable({
    children,
    initialX,
    initialY,
    onDragEnd,
    parentRef,
    className
}: DraggableProps) {
    const context = useContext(DragContext);

    const [isDragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    const offset = useRef({ x: 0, y: 0 });

    const dragRef = useRef<HTMLDivElement>(null);

    const dropRef = useRef<Droppable | undefined>(null);

    useEffect(() => {
        dropRef.current = context?.droppables;
        // checkCollision();
    }, []);

    const currentDrop = useRef<string | null>(null);

    function checkCollision(mode: "enter" | "drop") {
        if (!dropRef.current || !dragRef.current) return;

        const dragRect = dragRef.current?.getBoundingClientRect();
        let newOverId: string | null = null;

        dropRef.current.forEach((elem, key) => {
            if (elem) {
                if (!elem?.ref.current) return;

                const dropRect = elem.ref.current!.getBoundingClientRect();

                const isOverlapping =
                    dropRect.left < dragRect.right &&
                    dropRect.right > dragRect.left &&
                    dropRect.top < dragRect.bottom &&
                    dropRect.bottom > dragRect.top;

                if (isOverlapping) {
                    newOverId = key;

                    if (mode === "enter" && currentDrop.current !== key) {
                        // Call onEnter for the new droppable
                        elem.onEnter?.();
                    }

                    if (mode === "drop") {
                        // Call onDrop when drag ends
                        elem.onDrop?.(dragRef.current!);
                    }
                }
            }
        });

        if (
            mode === "enter" &&
            currentDrop.current &&
            currentDrop.current !== newOverId
        ) {
            const prev = dropRef.current.get(currentDrop.current);
            prev?.onLeave?.();
        }

        // Update the currently hovered droppable
        if (mode === "enter") currentDrop.current = newOverId;
    }

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        document.body.style.cursor = "grab";

        setDragging(true);

        context?.setActiveDrag({ id: crypto.randomUUID(), ref: dragRef });

        offset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };

        checkCollision("enter");
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !parentRef.current || !dragRef.current) return;

        document.body.style.cursor = "grabbing";

        const parentRect = parentRef.current.getBoundingClientRect();
        const dragRect = dragRef.current.getBoundingClientRect();

        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        // Clamp horizontally
        newX = Math.max(0, Math.min(newX, parentRect.width - dragRect.width));

        // Clamp vertically
        newY = Math.max(0, Math.min(newY, parentRect.height - dragRect.height));

        setPos({ x: newX, y: newY });

        checkCollision("enter");
    };

    const onMouseUp = () => {
        if (!isDragging) return;

        document.body.style.cursor = "default";

        setDragging(false);
        onDragEnd?.(pos.x, pos.y); // use committed position

        checkCollision("drop")
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={dragRef}
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                userSelect: "none",
            }}
            onMouseDown={onMouseDown}
            className={className}
        >
            {children}
        </div>
    );
}
