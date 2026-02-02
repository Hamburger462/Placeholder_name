import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { Case } from "../../types/clues";
import type { RootState } from "../../app/store"

const CasesAdapter = createEntityAdapter<Case, string>({
  selectId: (clue) => clue.id,
});


const CasesSlice = createSlice({
    name: 'clues',
    initialState: CasesAdapter.getInitialState(),
    reducers: {
        addCase: CasesAdapter.addOne,
        updateCase: CasesAdapter.updateOne,
        removeCase: CasesAdapter.removeOne,
    }
})

export const {addCase, updateCase, removeCase} = CasesSlice.actions;

export default CasesSlice.reducer;

export const CasesSelector = CasesAdapter.getSelectors((state: RootState) => state.cases);