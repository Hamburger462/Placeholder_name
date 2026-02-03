import type { Case, Clue } from "../types/clues"
import ClueElement from "../components/ClueElement"
import { useAppDispatch } from "../app/hooks"
import { CluesSelector } from "../features/clue/cluesSlice"
import { useEffect } from "react";
import { addClue, updateClue, removeClue } from "../features/clue/cluesSlice";

export default function Caseboard(data: Case){
    const dispatch = useAppDispatch;
    const clues = CluesSelector;
    useEffect(() => {
        console.log(clues)
    }, [clues])

    function pinClue(){
        const clueData: Clue = {
            id: "1",
            title: "Lorem ipsum",
            caseId: data.id,
            position: {
                x: 0,
                y: 0
            },
            mediaIds: []
        }

        // dispatch(addClue(clueData))
    }

    return (
    <>
        <h1>{data.title}</h1>
        <button onClick={() => pinClue()}>Add a clue</button>
    </>
    )
}