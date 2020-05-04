/**
 * This helper function is beeing used throughout the entire
 * application to display error messages for example.
 * Only if a value if provided the Message is shown, 
 * elsewise an empty React fragment is returned.
 * For more information about fragments visit: https://reactjs.org/docs/react-api.html#reactfragment
 * @param {object} props - The React props.
 */
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
    } else {
        return <></>;
    }
}
