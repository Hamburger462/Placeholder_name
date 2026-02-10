import { useConnectionsForCase } from "../custom_hooks/useConnectionSelector"
import { useCluesForCase } from "../custom_hooks/useClueSelectors";
import { type Connection } from "../types/clues";


interface ConnectionLayerProps {
    caseId: string,
}

export default function ConnectionLayer({caseId}: ConnectionLayerProps){
    const {connectionsByCaseId} = useConnectionsForCase(caseId);
    const {clueByClueIdInCase} = useCluesForCase(caseId);   

    // ADD CONNECTION RENDERING AND RE-RENDER THEM EACH TIME EITHER OF CLUES GET SHIFTED TO A DIFFERENT POSITION
    // ALSO ADD ROUTING AND SOME PAGES FOR AUTHORIZATION AND STORING CASES

    const renderConnection = (value: Connection) => {
        const clueFrom = clueByClueIdInCase(value.startId as string);
        const clueTo = clueByClueIdInCase(value.endId as string);


        return (<line key={crypto.randomUUID()} stroke="red" strokeWidth={2} x1={clueFrom?.position.x} y1={clueFrom?.position.y} x2={clueTo?.position.x} y2={clueTo?.position.y} />)
    }

    return (
        <svg>
            {connectionsByCaseId.map((value, index) => renderConnection(value))}
        </svg>
    )
}