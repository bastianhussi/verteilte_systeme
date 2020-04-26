export default function LoadingScreen() {
    return (
        <>
            <div>
                <h1>Fetching data...</h1>
            </div>
            <style jsx>{`
                div {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </>
    );
}
