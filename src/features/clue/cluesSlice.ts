import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { Clue } from "../../types/clues";
import type { RootState } from "../../app/store"

const ClueAdapter = createEntityAdapter<Clue, string>({
  selectId: (clue) => clue.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});


const CluesSlice = createSlice({
    name: 'clues',
    initialState: ClueAdapter.getInitialState(),
    reducers: {
        addClue: ClueAdapter.addOne,
        updateClue: ClueAdapter.updateOne,
        removeClue: ClueAdapter.removeOne,
    }
})

export const {addClue, updateClue, removeClue} = CluesSlice.actions;

export default CluesSlice.reducer;

export const CluesSelector = ClueAdapter.getSelectors((state: RootState) => state.clues);