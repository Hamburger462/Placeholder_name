import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    addMedia,
    updateMedia,
    removeMedia,
    MediaSelector,
} from "../features/media/mediaSlice";
import type { MediaItem } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

export function useMedia() {
    const dispatch = useAppDispatch();
    const allMedia = useAppSelector((state) => MediaSelector.selectAll(state));
    const allMediaEntities = useAppSelector((state) => MediaSelector.selectEntities(state));


    const pinMedia = (data: MediaItem) => dispatch(addMedia(data));
    const unpinMedia = (id: string) => dispatch(removeMedia(id));
    const renewMedia = (update: Update<MediaItem, string>) =>
        dispatch(updateMedia(update));

    return { allMedia, allMediaEntities, pinMedia, unpinMedia, renewMedia };
}

export function useMediaForMedia(mediaId: string) {
    const dispatch = useAppDispatch();

    const mediaForMedia = useAppSelector((state) =>
        MediaSelector.selectById(state, mediaId),
    );
    const renewMedia = (changes: Partial<MediaItem>) => {
        dispatch(
            updateMedia({
                id: mediaId,
                changes,
            }),
        );
    };

    return { mediaForMedia, renewMedia };
}

export function useMediaForClue(clueId: string) {
    const mediasForClue = useAppSelector((state) =>
        MediaSelector.selectAll(state).filter(
            (value) => value.clueId == clueId,
        ),
    );

    return { mediasForClue };
}
