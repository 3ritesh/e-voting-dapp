import "../styles/globals.css";
import { VoterProvider } from "../context/Voter";

const MyApp = ({ Component, pageProps }) => (
    <VoterProvider>
        <Component {...pageProps} />
    </VoterProvider>
);

export default MyApp;
