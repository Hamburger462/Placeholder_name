import { useConnectionsForCase } from "../custom_hooks/useConnectionSelector";
import { type Connection } from "../types/clues";

interface ConnectionLayerProps {
    caseId: string;
}

export default function ConnectionLayer({ caseId }: ConnectionLayerProps) {
    const { connectionsByCaseId } = useConnectionsForCase(caseId);

    // ADD CONNECTION RENDERING AND RE-RENDER THEM EACH TIME EITHER OF CLUES GET SHIFTED TO A DIFFERENT POSITION
    // ALSO ADD ROUTING AND SOME PAGES FOR AUTHORIZATION AND STORING CASES

    const renderConnection = (conn: Connection) => {
        const from = conn.pos1;
        const to = conn.id === "TempConnection" ? conn.cursorPos : conn.pos2;

        if (!from || !to) return null;

        return (
            <>
                {/* The line */}
                <line
                    key={conn.id + "-line"}
                    stroke="black"
                    strokeWidth={2}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                />

                {/* Small circle at cursor for temp connection */}
                {conn.id === "TempConnection" && to && (
                    <circle
                        key={conn.id + "-circle"}
                        cx={to.x}
                        cy={to.y}
                        r={10} // radius of circle
                        fill="black" // color of circle
                        pointerEvents="none" // allows clicks to pass through
                    />
                )}
            </>
        );
    };

    return (
        <svg>{connectionsByCaseId.map((value) => renderConnection(value))}</svg>
    );
}
