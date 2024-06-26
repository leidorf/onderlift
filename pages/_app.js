import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../public/assets/css/style.css";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
export default MyApp;
