import Droppable from "../Droppable";

interface AddZoneProps{
    className: string,
    id: string
}

export default function AddZone({className, id} : AddZoneProps){
    return (
    <Droppable id={id} className={className}>
        <div>Add Clue</div>
    </Droppable>
    )
}