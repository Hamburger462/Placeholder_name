import { db } from "./firebase";
import { getDocs, query, where, collection, orderBy } from "firebase/firestore";

import { useEffect, useContext } from "react";

import { useCases } from "../custom_hooks/useCasesSelectors";
import { useClues } from "../custom_hooks/useClueSelectors";
import { useConnections } from "../custom_hooks/useConnectionSelector";
import { useMedia } from "../custom_hooks/useMediaSelectors";
import {
    type Case,
    type Clue,
    type Connection,
    type MediaItem,
} from "../types/clues";

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
    const cluesSnapshot = await getDocs(
        collection(db, "Cases", caseId, "Clues"),
    );

    const clueIds: string[] = [];

    for (const clueDoc of cluesSnapshot.docs) {
        const clueData = clueDoc.data();
        const clueId = clueDoc.id;

        clueIds.push(clueId);

        const mediaSnapshot = await getDocs(
            query(
                collection(db, "Cases", caseId, "Clues", clueId, "Media"),
                orderBy("order"),
            ),
        );

        const mediaIds = mediaSnapshot.docs.map((mediaDoc) => mediaDoc.id);

        pinClue({
            id: clueId,
            caseId,
            title: clueData.title,
            position: {
                x: clueData.position.x,
                y: clueData.position.y,
            },
            mediaIds,
        });
    }

    return clueIds;
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

export async function loadMedias(
    pinMedia: (data: MediaItem) => void,
    caseId: string,
    clueId: string,
) {
    const snapshot = await getDocs(
        collection(db, "Cases", caseId, "Clues", clueId, "Media"),
    );

    snapshot.forEach((doc) => {
        const data = doc.data();

        pinMedia({
            id: doc.id,
            clueId,
            type: data.type,
        });
    });
}

export function SubscribeFirestore() {
    const context = useContext(authContext);

    const { pinCase } = useCases();
    const { pinClue } = useClues();
    const { pinConnection } = useConnections();
    const { pinMedia } = useMedia();

    useEffect(() => {
        async function load() {
            if (!context?.authInfo) return;

            const caseIds = await loadCases(pinCase, context.authInfo.id);

            for (const caseId of caseIds) {
                const clueIds = await loadClues(pinClue, caseId);

                for (const clueId of clueIds) {
                    await loadMedias(pinMedia, caseId, clueId);
                }

                await loadConnections(pinConnection, caseId);
            }
        }

        load();
    }, [context?.authInfo]);

    return null;
}
