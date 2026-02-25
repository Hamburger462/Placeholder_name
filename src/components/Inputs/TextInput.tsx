

type TextInputProps = {
    content: any;
    setContent: React.Dispatch<any>;
    name: string;
    className?: string;
};

export default function TextInput({
    content,
    setContent,
    name,
    className
}: TextInputProps) {
    const changeText = (event: React.InputEvent) => {

        setContent((event.target as HTMLInputElement).value)
    }

    return (
        <input
            value={content}
            name={name}
            onInput={changeText}
            className={className}
        ></input>
    );
}
