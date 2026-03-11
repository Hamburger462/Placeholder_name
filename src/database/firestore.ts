import { db } from "./firebase";
import { getDocs, query, where, collection } from "firebase/firestore";

import { useEffect, useContext } from "react";

import { useCases } from "../custom_hooks/useCasesSelectors";
import { useClues } from "../custom_hooks/useClueSelectors";
import { useConnections } from "../custom_hooks/useConnectionSelector";
import { type Case, type Clue, type Connection } from "../types/clues";

import { authContext } from "../context/authContext";

export async function loadCases(pinCase: (data: Case) => void, userId: string) {
    const q = query(collection(db, "Cases"), where("userId", "==", userId));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
        const data = doc.data();

        pinCase({
            id: doc.id,
            title: data.title,
            clueIds: [],
        });
    });

    return snapshot.docs.map((doc) => doc.id);
}

export async function loadClues(pinClue: (data: Clue) => void, caseId: string) {
    const snapshot = await getDocs(collection(db, "Cases", caseId, "Clues"));

    snapshot.forEach((doc) => {
        const docData = doc.data();
        pinClue({
            id: doc.id,
            caseId,
            title: docData.title,
            position: {
                x: docData.position.x,
                y: docData.position.y,
            },
            mediaIds: docData.mediaIds,
        });
    });
}

export async function loadConnections(
    pinConnection: (data: Connection) => void,
    caseId: string,
) {
    const snapshot = await getDocs(
        collection(db, "Cases", caseId, "Connections"),
    );

    snapshot.forEach((doc) => {
        const docData = doc.data();
        pinConnection({
            id: doc.id,
            caseId,
            startId: docData.startId,
            endId: docData.endId,
            pos1: docData.pos1,
            pos2: docData.pos2,
        });
    });
}

export function SubscribeFirestore() {
    const context = useContext(authContext);

    const { pinCase } = useCases();
    const { pinClue } = useClues();
    const { pinConnection } = useConnections();
    useEffect(() => {
        async function load() {
            if (!context?.authInfo) return;

            const caseIds = await loadCases(pinCase, context.authInfo.id);

            for (const caseId of caseIds) {
                await loadClues(pinClue, caseId);
                await loadConnections(pinConnection, caseId);
            }
        }

        load();
    }, [context?.authInfo]);

    return null;
}
