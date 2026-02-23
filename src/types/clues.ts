export type MediaItem =
    | {
          id: number;
          clueId: number;
          type: "text";
          text: string;
      }
    | {
          id: number;
          clueId: number;
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
    content?: Array<string>;
    position: {
        x: number;
        y: number;
    };
};

export type Case = {
    id: string;
    title: string;
    clueIds ?: Array<number>;
};
