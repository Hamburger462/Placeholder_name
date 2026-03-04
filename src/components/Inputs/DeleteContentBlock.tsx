import { useContext } from "react"
import { DragContext } from "../../context/dragContext"

import { useMedia } from "../../custom_hooks/useMediaSelectors";

import { Container } from "@mui/material";

export default function DeleteContentBlock(){
    const context = useContext(DragContext);

    const {unpinMedia} = useMedia();

    const handleContentDelete = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if(!context?.activeContent) return;
        unpinMedia(context.activeContent);
        context.setActiveContent(null);
    }

    return (<Container sx={{height: "100px", border: "2px solid"}} onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()} onDrop={event => handleContentDelete(event)}>Delete zone</Container>)
}