import Droppable from "../Droppable";


import "../../styles/CaseBoard.css"
interface DeleteZoneProps{
    caseId: string
}


export default function DeleteZone({caseId} : DeleteZoneProps){
    return (
    <Droppable id={`DEATHZONE-${caseId}`} className="ClueDrop DeleteZoneDrop" >
        <div>Delete Clue</div>
    </Droppable>
    )
}