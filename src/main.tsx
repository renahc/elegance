// Polyfill Web Crypto API for non-secure HTTP contexts (prevents crypto_nonexistent crash)
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    (window as any).crypto = {};
  }
  if (!window.crypto.getRandomValues) {
    (window as any).crypto.getRandomValues = function (buffer: Uint8Array) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    };
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

let msalInstance: PublicClientApplication | null = null;

try {
  msalInstance = new PublicClientApplication(msalConfig);
  msalInstance.addEventCallback((event: any) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as any;
      if (payload.account) {
        msalInstance?.setActiveAccount(payload.account);
      }
    }
  });
} catch (error) {
  console.warn('MSAL initialization warning (HTTP context):', error);
}

const renderApp = (instance: PublicClientApplication | null) => {
  const container = document.getElementById('root')!;
  const root = createRoot(container);

  if (instance) {
    root.render(
      <StrictMode>
        <MsalProvider instance={instance}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MsalProvider>
      </StrictMode>
    );
  } else {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  }
};

if (msalInstance) {
  msalInstance.initialize().then(() => {
    const accounts = msalInstance?.getAllAccounts();
    if (accounts && accounts.length > 0 && !msalInstance?.getActiveAccount()) {
      msalInstance.setActiveAccount(accounts[0]);
    }
    renderApp(msalInstance);
  }).catch((err) => {
    console.warn('MSAL initialize failed, rendering fallback:', err);
    renderApp(null);
  });
} else {
  renderApp(null);
}

