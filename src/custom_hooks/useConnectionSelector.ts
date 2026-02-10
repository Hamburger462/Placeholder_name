import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addConnection, removeConnection, updateConnection, ConnectionSelector } from "../features/connection/connectionSlice";
import type { Connection } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

import { createSelector } from "@reduxjs/toolkit";

import { type RootState } from "../app/store";

import { useMemo } from "react";

export const makeSelectConnectionsByCaseId = () =>
  createSelector(
    [
      ConnectionSelector.selectAll,
      (_: RootState, caseId: string) => caseId
    ],
    (connections, caseId) =>
      connections.filter(c => c.caseId === caseId)
  );


export function useConnections(){
    const dispatch = useAppDispatch();
    const allConnections = useAppSelector(state => ConnectionSelector.selectAll(state));
    const pinConnection = (data: Connection) => dispatch(addConnection(data));
    const unpinConnection = (id: string) => dispatch(removeConnection(id));
    const renewConnection = (update: Update<Connection, string>) => dispatch(updateConnection(update));


    return {allConnections, pinConnection, unpinConnection, renewConnection};
}

export function useConnectionsForCase(caseId: string){
    const dispatch = useAppDispatch();
      const selectConnections = useMemo(
    makeSelectConnectionsByCaseId,
    []
  );

  const connectionsByCaseId = useAppSelector(state =>
    selectConnections(state, caseId)
  );
    
    return {connectionsByCaseId};
}