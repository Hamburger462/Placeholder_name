import type { Clue } from "../types/clues"

export default function ClueElement(data: Clue){


    return (
        <>
            <h1>{data.title}</h1>
        </>
    )
}