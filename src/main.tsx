import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './config/msalConfig';
import './index.css';
import App from './App';

const msalInstance = new PublicClientApplication(msalConfig);

// Set active account automatically on LOGIN_SUCCESS event
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as any;
    if (payload.account) {
      msalInstance.setActiveAccount(payload.account);
    }
  }
});

msalInstance.initialize().then(() => {
  // Only process redirect promise if authentication code exists in hash/search
  if (window.location.hash.includes('code=') || window.location.search.includes('code=')) {
    msalInstance.handleRedirectPromise().then((res) => {
      if (res && res.account) {
        msalInstance.setActiveAccount(res.account);
      }
    }).catch((err) => {
      console.warn('MSAL handleRedirectPromise:', err);
    }).finally(() => {
      if (window.opener) {
        window.close();
      }
    });
  }


  // If accounts exist in cache, set the first account as active
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // If this window is a popup processing authentication redirect, stop rendering React
  if (window.opener && (window.location.hash.includes('code=') || window.location.search.includes('code='))) {
    return;
  }





  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>,
  );
});
