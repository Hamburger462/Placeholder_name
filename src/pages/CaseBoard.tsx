import type { Case, Clue } from "../types/clues"
import ClueElement from "../components/ClueElement"
import { useEffect, useState } from "react";
import {useCluesForCase} from "../custom_hooks/useClueSelectors";

type CaseBoardProps = {
    data: Case
}

export default function Caseboard({data}: CaseBoardProps){
    // const {cluesByCaseId, pinClue, unpinClue, renewClue} = useCluesForCase(data.id);

    const [title, useTitle] = useState("");
    const [desc, useDesc] = useState(""); 

    return (
    <>
        <h2>This is a caseboard</h2>
        <div>{data.title}</div>
        <form>
            <label>
                <span>Title</span>
                <input type="text" name="title" value={title} onChange={(event) => useTitle(event.target.value)}></input>
            </label>
        </form>
        <button>Add a clue</button>
    </>
    )
}