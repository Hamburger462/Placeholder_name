export type MediaItem =
    | {
          id: string;
          clueId: string;
          type: "text";
          text: string;
      }
    | {
          id: string;
          clueId: string;
          type: "image" | "video" | "audio";
          url: string;
          name?: string;
      };

export type Connection = {
    id: string;
    caseId: string | undefined;
    startId: string | undefined | null;
    endId: string | undefined | null;
    pos1?: {x: number, y: number};
    pos2?: {x: number, y: number};
    cursorPos?: {x: number, y: number};
};

export type Clue = {
    id: string;
    caseId: string;
    title?: string;
    mediaIds?: Array<string>;
    position: {
        x: number;
        y: number;
    };
};

export type Case = {
    id: string;
    title: string;
    clueIds ?: Array<string>;
};
