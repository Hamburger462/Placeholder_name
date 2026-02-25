import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { MediaItem } from "../../types/clues";
import type { RootState } from "../../app/store"

const MediaAdapter = createEntityAdapter<MediaItem, string>({
  selectId: (media) => media.id,
});


const MediaSlice = createSlice({
    name: 'media',
    initialState: MediaAdapter.getInitialState(),
    reducers: {
        addMedia: MediaAdapter.addOne,
        updateMedia: MediaAdapter.updateOne,
        removeMedia: MediaAdapter.removeOne,
    }
})

export const {addMedia, updateMedia, removeMedia} = MediaSlice.actions;

export default MediaSlice.reducer;

export const MediaSelector = MediaAdapter.getSelectors((state: RootState) => state.media);