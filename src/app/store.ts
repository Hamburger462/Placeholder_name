import { configureStore } from "@reduxjs/toolkit";
import CluesReducer from "../features/clue/cluesSlice"
import ConnectionsReducer from "../features/connection/connectionSlice"
import CasesReducer  from "../features/case/casesSlice";
import MediaReducer from "../features/media/mediaSlice"

export const store = configureStore({
    reducer: {
        clues: CluesReducer,
        connections: ConnectionsReducer,
        cases: CasesReducer,
        media: MediaReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch