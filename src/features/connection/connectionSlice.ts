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
        addConnection: ConnectionAdapter.addOne,
        updateConnection: ConnectionAdapter.updateOne,
        removeConnection: ConnectionAdapter.removeOne,
    }
})

export const {addConnection, updateConnection, removeConnection} = ConnectionSlice.actions;

export default ConnectionSlice.reducer;

export const ConnectionSelector = ConnectionAdapter.getSelectors((state: RootState) => state.connections);