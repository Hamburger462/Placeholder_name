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
    caseId: string;
    startId: number;
    endId: number;
};

export type Clue = {
    id: string;
    caseId: string;
    title: string;
    mediaIds: Array<string>;
    position: {
        x: number;
        y: number;
    };
};

export type Case = {
    id: string;
    title: string;
    clueIds: Array<number>;
};
