import { useConnectionsForCase } from "../custom_hooks/useConnectionSelector"


interface ConnectionLayerProps {
    caseId: string,
}

export default function ConnectionLayer({caseId}: ConnectionLayerProps){
    const {connectionsByCaseId} = useConnectionsForCase(caseId);

    // ADD CONNECTION RENDERING AND RE-RENDER THEM EACH TIME EITHER OF CLUES GET SHIFTED TO A DIFFERENT POSITION
    // ALSO ADD ROUTING AND SOME PAGES FOR AUTHORIZATION AND STORING CASES

    return (
        <svg style={{position: "absolute"}}>
            {connectionsByCaseId.map((value, index) => {
                return (<line />)
            })}
        </svg>
    )
}