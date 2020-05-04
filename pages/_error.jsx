/**
 * This will render when a HTTP-Error with the status code of 500 occurres (Internal Server Error).
 * The page exists to provide a consistent design and user experience.
 */
export default function Error({ statusCode }) {
    return (
        <>
            <h1>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </h1>
            <style jsx>{`
                h1 {
                    text-align: center;
                }
            `}</style>
        </>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};
