import Droppable from "../Droppable";


import "../../styles/CaseBoard.css"
interface DeleteZoneProps{
    id: string
}


export default function DeleteZone({id} : DeleteZoneProps){
    return (
    <Droppable id={id} className="ClueDrop DeleteZoneDrop" >
        <div>Delete Clue</div>
    </Droppable>
    )
}