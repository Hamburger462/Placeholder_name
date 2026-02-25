

type ContentBlockProps = {
    children?: React.ReactNode
}

export default function ContentBlock({children}: ContentBlockProps){


    return (
    <div draggable={true} style={{padding: "6px", border: "1px solid", }}>
        <div>Grab me</div>
        {children}
    </div>)
}