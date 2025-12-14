export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    // Also save to cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Also remove from cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const isTokenValid = () => {
  return !!getToken();
};