import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import { useEffect } from "react";
import "../styles/index.scss";
import "../../public/assets/css/luxury-skincare.css";
import "../../public/assets/css/aura-ux-refresh.css";

const appFontVars = {
  "--font-body": '"SF Pro Text", "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  "--font-display": 'Georgia, "Times New Roman", serif',
};

const shouldEnableServiceWorker = () => process.env.NEXT_PUBLIC_ENABLE_SW === "true";
const pageNeedsBootstrapJs = () => typeof document !== "undefined" && !!document.querySelector("[data-bs-toggle]");

const registerSW = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed:", registrationError);
      });
  }
};

const clearServiceWorkersAndCaches = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }
};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (pageNeedsBootstrapJs()) {
        import("bootstrap/dist/js/bootstrap");
      }
      ReactModal.setAppElement("body");

      if (shouldEnableServiceWorker()) {
        registerSW();
      } else {
        clearServiceWorkersAndCaches().catch((error) => {
          console.log("Failed to clear service workers/caches:", error);
        });
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <div id="root" className="app-root" style={appFontVars}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
