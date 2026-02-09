import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addConnection, removeConnection, updateConnection, ConnectionSelector } from "../features/connection/connectionSlice";
import type { Connection } from "../types/clues";
import type { Update } from "@reduxjs/toolkit";

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
    const connectionsByCaseId = useAppSelector(state => ConnectionSelector.selectAll(state).filter((value) => value.caseId == caseId));

    return {connectionsByCaseId}
}