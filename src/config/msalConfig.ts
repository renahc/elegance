// Azure AD MSAL Configuration for Élégance Beauty Studio
export const msalConfig = {
  auth: {
    clientId: '413ae20f-d59e-4b81-8864-97d5945f7d5f',
    authority: 'https://login.microsoftonline.com/ff064edc-07f4-448c-97e1-49da14c085f5',
    redirectUri: import.meta.env.VITE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

