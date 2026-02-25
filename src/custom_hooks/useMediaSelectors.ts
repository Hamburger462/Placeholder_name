import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addMedia, updateMedia, removeMedia, MediaSelector } from "../features/media/mediaSlice";
import type { MediaItem } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

export function useMedia(){
    const dispatch = useAppDispatch();
    const allMedia = useAppSelector(state => MediaSelector.selectAll(state));
    const pinMedia = (data: MediaItem) => dispatch(addMedia(data));
    const unpinMedia = (id: string) => dispatch(removeMedia(id));
    const renewMedia = (update: Update<MediaItem, string>) => dispatch(updateMedia(update));


    return {allMedia, pinMedia, unpinMedia, renewMedia};
}