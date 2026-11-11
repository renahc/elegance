import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/msalConfig";
import "./index.css";
import App from "./App";

const instance = new PublicClientApplication(msalConfig);
instance.addEventCallback((event) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS &&
    event.payload &&
    "account" in event.payload &&
    event.payload.account
  )
    instance.setActiveAccount(event.payload.account);
});
instance
  .initialize()
  .then(async () => {
    const response = await instance.handleRedirectPromise();
    const account =
      response?.account ||
      instance.getActiveAccount() ||
      instance.getAllAccounts()[0];
    if (account) instance.setActiveAccount(account);
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <MsalProvider instance={instance}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MsalProvider>
      </StrictMode>,
    );
  })
  .catch(() => {
    document.getElementById("root")!.textContent =
      "No se pudo iniciar la autenticación. Abre el sitio por HTTPS y revisa la configuración de Microsoft Entra ID.";
  });
