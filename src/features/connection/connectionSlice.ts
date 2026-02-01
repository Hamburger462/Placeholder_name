import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { Connection } from "../../types/clues";
import type { RootState } from "../../app/store"

const ConnectionAdapter = createEntityAdapter<Connection, string>({
  selectId: (connection) => connection.id,
});


const ConnectionSlice = createSlice({
    name: 'connections',
    initialState: ConnectionAdapter.getInitialState(),
    reducers: {
        addClue: ConnectionAdapter.addOne,
        updateClue: ConnectionAdapter.updateOne,
        removeClue: ConnectionAdapter.removeOne,
    }
})

export const {addClue, updateClue, removeClue} = ConnectionSlice.actions;

export default ConnectionSlice.reducer;

export const ConnectionSelector = ConnectionAdapter.getSelectors((state: RootState) => state.connections);