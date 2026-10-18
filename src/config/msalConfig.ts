const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin.endsWith('/')
      ? window.location.origin.slice(0, -1)
      : window.location.origin;
  }
  return 'http://localhost:5173';
};

const baseOrigin = import.meta.env.VITE_REDIRECT_URI || getOrigin();

export const msalConfig = {
  auth: {
    clientId: '304d54f7-d485-478a-a1ea-0c2f874b0c1f',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/7607c5a6-994c-4951-92bc-3af0cf3eb713',
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
  // Solicitamos el scope expuesto de TU propia API en Azure AD
  scopes: ['api://304d54f7-d485-478a-a1ea-0c2f874b0c1f/access_as_user', 'openid', 'profile', 'email'],
  redirectUri: baseOrigin,
};

