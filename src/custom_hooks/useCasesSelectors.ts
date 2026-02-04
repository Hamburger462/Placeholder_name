import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addCase, updateCase, removeCase, CasesSelector } from "../features/case/casesSlice";
import type { Case } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

export function useCases(){
    const dispatch = useAppDispatch();
    const allCases = useAppSelector(state => CasesSelector.selectAll(state));
    const pinCase = (data: Case) => dispatch(addCase(data));
    const unpinCase = (id: string) => dispatch(removeCase(id));
    const renewCase = (update: Update<Case, string>) => dispatch(updateCase(update));


    return {allCases, pinCase, unpinCase, renewCase};
}