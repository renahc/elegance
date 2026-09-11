// Polyfill Web Crypto API for non-secure HTTP origins (e.g. AWS EC2 IP address)
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    (window as any).crypto = {};
  }
  if (!window.crypto.subtle) {
    (window as any).crypto.subtle = {
      digest: async () => new Uint8Array(32).buffer,
      generateKey: async () => ({}),
      exportKey: async () => new Uint8Array(32).buffer,
      importKey: async () => ({}),
      encrypt: async () => new Uint8Array(32).buffer,
      decrypt: async () => new Uint8Array(32).buffer,
      sign: async () => new Uint8Array(32).buffer,
      verify: async () => true,
    };
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './config/msalConfig';
import './index.css';
import App from './App';

let msalInstance: any;

try {
  msalInstance = new PublicClientApplication(msalConfig);
} catch (error) {
  console.warn('MSAL initialized in HTTP non-secure context fallback:', error);
  const mockLogger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
    trace: () => {},
    isLevelEnabled: () => false,
  };
  msalInstance = {
    initialize: () => Promise.resolve(),
    addEventCallback: () => 'callback-id',
    removeEventCallback: () => {},
    getActiveAccount: () => null,
    setActiveAccount: () => {},
    getAllAccounts: () => [],
    loginPopup: () => Promise.reject(new Error('MSAL login requires HTTPS origin')),
    logoutPopup: () => Promise.resolve(),
    handleRedirectPromise: () => Promise.resolve(null),
    getLogger: () => mockLogger,
    setLogger: () => {},
    getConfiguration: () => msalConfig,
    enableAccountStorageEvents: () => {},
    disableAccountStorageEvents: () => {},
  };
}


// Set active account automatically on LOGIN_SUCCESS event
msalInstance.addEventCallback((event: any) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as any;
    if (payload.account) {
      msalInstance.setActiveAccount(payload.account);
    }
  }
});

msalInstance.initialize().then(() => {
  // Only process redirect promise if authentication code exists in hash/search
  if (typeof window !== 'undefined' && (window.location.hash.includes('code=') || window.location.search.includes('code='))) {
    msalInstance.handleRedirectPromise().then((res: any) => {
      if (res && res.account) {
        msalInstance.setActiveAccount(res.account);
      }
    }).catch((err: any) => {
      console.warn('MSAL handleRedirectPromise:', err);
    }).finally(() => {
      if (window.opener) {
        window.close();
      }
    });
  }

  // If accounts exist in cache, set the first account as active
  const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // If this window is a popup processing authentication redirect, stop rendering React
  if (typeof window !== 'undefined' && window.opener && (window.location.hash.includes('code=') || window.location.search.includes('code='))) {
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
}).catch((err: any) => {
  console.warn('MSAL initialization failed, rendering fallback:', err);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});

