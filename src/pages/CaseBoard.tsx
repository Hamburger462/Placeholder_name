import type { Case, Clue } from "../types/clues"
import ClueElement from "../components/ClueElement"
import { useEffect, useState } from "react";
import useClueSelectors from "../custom_hooks/useClueSelectors";

export default function Caseboard(data: Case){
    const {cluesByCaseId, pinClue, unpinClue, renewClue} = useClueSelectors(data.id);

    const [title, useTitle] = useState("");
    const [desc, useDesc] = useState(""); 

    return (
    <>
        <h1>This is a caseboard</h1>
        <form>
            <label>
                <span>Title</span>
                <input type="text" name="title" value={title} onChange={(event) => useTitle(event.target.value)}></input>
            </label>
            <label>
                <span>Desc</span>
                <input type="text" name="desc" value={desc} onChange={(event) => useDesc(event.target.value)}></input>
            </label>
        </form>
        <button onClick={() => {
            const clueData: Clue = {
                id: crypto.randomUUID(),
                title: title,
                caseId: data.id,
                mediaIds: [],
                position: {
                    x: 0,
                    y: 0
                }
            }
            pinClue(clueData)
        }}>Add a clue</button>
    </>
    )
}