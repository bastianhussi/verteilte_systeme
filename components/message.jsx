export default function Message(props) {
    if (props.value) {
        return (
            <p>
                {props.value}
                <style jsx>{`
                    p {
                        color: var(--dark-blue);
                    }
                `}</style>
            </p>
        );
    }
    return <></>;
}
