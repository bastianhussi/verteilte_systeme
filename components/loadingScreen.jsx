/**
 * This helper function is beeing used throughout the entire
 * application to display a loading screen.
 * This follows the example at: https://www.w3schools.com/howto/howto_css_loader.asp
 */
export default function LoadingScreen() {
    return (
        <>
            <div>
                <span></span>
            </div>
            <style jsx>{`
                div {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: wait;
                }
                span {
                    border: 16px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 16px solid var(--dark-purple);
                    width: 120px;
                    height: 120px;
                    -webkit-animation: spin 2s linear infinite; /* Safari */
                    animation: spin 2s linear infinite;
                }
                /* Safari */
                @-webkit-keyframes spin {
                    0% {
                        -webkit-transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                    }
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    );
}
