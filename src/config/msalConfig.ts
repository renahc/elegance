const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin.endsWith('/')
      ? window.location.origin.slice(0, -1)
      : window.location.origin;
  }
  return 'http://localhost:5173';
};

const baseOrigin = import.meta.env.VITE_REDIRECT_URI || getOrigin();
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || '7607c5a6-994c-4951-92bc-3af0cf3eb713';
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '304d54f7-d485-478a-a1ea-0c2f874b0c1f';
const apiScope = import.meta.env.VITE_AZURE_API_SCOPE || `api://${clientId}/access_as_user`;

export const msalConfig = {
  auth: {
    clientId,
    authority: import.meta.env.VITE_AZURE_AUTHORITY || `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: baseOrigin,
    postLogoutRedirectUri: baseOrigin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [apiScope],
  redirectUri: baseOrigin,
};
