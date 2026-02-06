import Droppable from "../Droppable";

interface DeleteZoneProps{
    className: string,
    id: string
}


export default function AddZone({className, id} : DeleteZoneProps){
    return (
    <Droppable id={id} className={className}>
        <div>Delete Clue</div>
    </Droppable>
    )
}