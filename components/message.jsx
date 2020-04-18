export default function Message(props) {
    if(props.value) {
        return <p>{props.value}</p>
    } else {
        return <></>
    }
}
