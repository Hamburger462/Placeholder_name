import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";

import { addClue, updateClue, removeClue, CluesSelector } from "../features/clue/cluesSlice";

import type { Clue } from "../types/clues";

import type { Update } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

import { useMemo } from "react";


export const makeSelectCluesByCaseId = () =>
  createSelector(
    [
      CluesSelector.selectAll,
      (_: RootState, caseId: string) => caseId
    ],
    (clues, caseId) =>
      clues.filter((clue) => clue.caseId === caseId)
  );


export function useCluesForCase(caseId: string) {
  const dispatch = useAppDispatch();

  const selectCluesByCaseId = useMemo(
    makeSelectCluesByCaseId,
    []
  );

  const cluesByCaseId = useAppSelector(state =>
    selectCluesByCaseId(state, caseId)
  );

  const clueByClueIdInCase = (clueId?: string) => cluesByCaseId.find((value) => value.id == clueId);

  const pinClue = (data: Clue) =>
    dispatch(addClue(data));

  const unpinClue = (id: string) =>
    dispatch(removeClue(id));

  const renewClue = (update: Update<Clue, string>) =>
    dispatch(updateClue(update));

  return {
    cluesByCaseId,
    clueByClueIdInCase,
    pinClue,
    unpinClue,
    renewClue
  };
}

export function useCluesForClue(clueId: string) {
  const dispatch = useAppDispatch();

  const clue = useAppSelector((state) =>
    CluesSelector.selectById(state, clueId)
  );

  const changePos = (x: number, y: number) => {
    dispatch(
      updateClue({
        id: clueId,
        changes: {
          position: { x, y }
        }
      })
    );
  };

  return {
    clue,
    changePos
  };
}
