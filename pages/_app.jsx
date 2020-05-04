import '../public/styles.css';

/**
 * This component is the protype for each React component in this app.
 * The reason for this is that this way all the styling in public/styles.css
 * can be used in all of the project (consistent design and reusability)
 * @param {object} param0
 */
export default function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps}>
            <link
                href='https://fonts.googleapis.com/css2?family=Roboto&display=swap'
                rel='stylesheet'
            />
            <link
                href='https://fonts.googleapis.com/icon?family=Material+Icons'
                rel='stylesheet'
            />
        </Component>
    );
}
