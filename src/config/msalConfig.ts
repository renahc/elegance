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
    clientId: '413ae20f-d59e-4b81-8864-97d5945f7d5f',
    authority: 'https://login.microsoftonline.com/ff064edc-07f4-448c-97e1-49da14c085f5',
    redirectUri: baseOrigin.endsWith('/redirect.html') ? baseOrigin : `${baseOrigin}/redirect.html`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

