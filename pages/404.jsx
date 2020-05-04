/**
 * This will render when a HTTP-Error with the status code of 404 occurres (page not found).
 * The page exists to provide a consistent design and user experience.
 */
export default function NotFound() {
    return (
        <>
            <h1>404 - Not Found</h1>
            <style jsx>{`
                h1 {
                    text-align: center;
                }
            `}</style>
        </>
    );
}
