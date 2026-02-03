import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addClue, updateClue, removeClue, CluesSelector } from "../features/clue/cluesSlice";
import type { Clue } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

export default function useClueSelectors(caseId: string){
    const dispatch = useAppDispatch();
    const cluesByCaseId = useAppSelector(CluesSelector.selectAll).filter((clue) => clue.caseId === caseId);
    const pinClue = (data: Clue) => dispatch(addClue(data));
    const unpinClue = (id: string) => dispatch(removeClue(id));
    const renewClue = (update: Update<Clue, string>) => dispatch(updateClue(update));


    return {cluesByCaseId, pinClue, unpinClue, renewClue};
}