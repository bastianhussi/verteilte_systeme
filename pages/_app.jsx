import '../public/styles.css';

// This default export is required in a new `pages/_app.js` file.
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
