import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const setToken = (token: string) => {
  // Set cookie with httpOnly and secure flags, expires in 24 hours
  Cookies.set(TOKEN_KEY, token, {
    expires: 1, // 1 day
    path: '/',
    sameSite: 'strict',
    secure: window.location.protocol === 'https:'
  });
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
