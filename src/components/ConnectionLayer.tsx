import { useConnectionsForCase } from "../custom_hooks/useConnectionSelector";
import { type Connection } from "../types/clues";

interface ConnectionLayerProps {
    caseId: string;
}

export default function ConnectionLayer({ caseId }: ConnectionLayerProps) {
    const { connectionsByCaseId } = useConnectionsForCase(caseId);

    const renderConnection = (conn: Connection) => {
        const from = conn.pos1;
        const to = conn.id === "TempConnection" ? conn.cursorPos : conn.pos2;

        if (!from || !to) return null;

        return (
            <g key={conn.id}>
                <line
                    stroke="black"
                    strokeWidth={2}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                />

                {conn.id === "TempConnection" && (
                    <circle
                        cx={to.x}
                        cy={to.y}
                        r={10}
                        fill="black"
                        pointerEvents="none"
                    />
                )}
            </g>
        );
    };

    return (
        <svg>{connectionsByCaseId.map((value) => renderConnection(value))}</svg>
    );
}
