import { useState, useRef, useEffect, useContext } from "react";
import { DragContext, type Droppable } from "../context/dragContext";

export type onDragEndPos = {
                x: number;
            y: number;
            height: number;
            width: number;
            setPos: React.Dispatch<
                React.SetStateAction<{ x: number; y: number }>
            >;
        }

export type DraggableProps = {
    children?: React.ReactNode;
    initialX: number;
    initialY: number;
    onDragEnd?: (
        dragPos: onDragEndPos,
        payloadAction?: any,
    ) => void;
    parentRef: React.RefObject<HTMLDivElement | null>;
    className?: string;
    payload?: {};
};

export default function Draggable({
    children,
    initialX,
    initialY,
    onDragEnd,
    parentRef,
    className,
    payload,
}: DraggableProps) {
    const context = useContext(DragContext);

    const [isDragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const livePos = useRef({ x: 0, y: 0 });

    const offset = useRef({ x: 0, y: 0 });

    const dragRef = useRef<HTMLDivElement>(null);

    const dropRef = useRef<Droppable | undefined>(null);

    useEffect(() => {
        dropRef.current = context?.droppables;
    }, [context?.droppables]);

    const currentDrop = useRef<string | null>(null);

    function checkCollision(payload?: any) {
        if (!dropRef.current || !dragRef.current) return;

        const dragRect = dragRef.current.getBoundingClientRect();
        let newOverId: string | null = null;

        dropRef.current.forEach((elem, key) => {
            if (!elem?.ref.current) return;
            const dropRect = elem.ref.current.getBoundingClientRect();

            const isOverlapping =
                dropRect.left < dragRect.right &&
                dropRect.right > dragRect.left &&
                dropRect.top < dragRect.bottom &&
                dropRect.bottom > dragRect.top;

            if (isOverlapping && newOverId === null) {
                newOverId = key;

                if (currentDrop.current !== key) {
                    elem.onEnter?.(payload);
                }
            }
        });

        if (currentDrop.current && currentDrop.current !== newOverId) {
            const prev = dropRef.current.get(currentDrop.current);
            prev?.onLeave?.();
        }

        currentDrop.current = newOverId;
    }

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        document.body.style.cursor = "grabbing";

        setDragging(true);

        context?.setActiveDrag({ id: crypto.randomUUID(), ref: dragRef });

        offset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };

        checkCollision();
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !parentRef.current || !dragRef.current) return;

        const parentRect = parentRef.current.getBoundingClientRect();
        const dragRect = dragRef.current.getBoundingClientRect();

        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        // Clamp horizontally
        newX = Math.max(0, Math.min(newX, parentRect.width - dragRect.width));

        // Clamp vertically
        newY = Math.max(0, Math.min(newY, parentRect.height - dragRect.height));

        setPos({ x: newX, y: newY });
        livePos.current = { x: newX, y: newY };

        checkCollision();
    };

    const onMouseUp = () => {
        if (!isDragging) return;

        document.body.style.cursor = "default";

        setDragging(false);

        const DragRect = dragRef.current!.getBoundingClientRect();

        onDragEnd?.(
            {
                x: livePos.current.x,
                y: livePos.current.y,
                height: DragRect.height,
                width: DragRect.width,
                setPos: setPos,
            },
            currentDrop.current,
        ); // use committed position

        checkCollision();
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
                cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={onMouseDown}
            className={className}
        >
            {children}
        </div>
    );
}
