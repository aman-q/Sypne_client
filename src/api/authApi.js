import client from './client';

export const register = (data) => client.post('/user/register', data);

export const verifyOtp = (data) => client.post('/user/verify-otp', data);

export const resendOtp = (email) => client.post('/user/resend-otp', { email });

export const login = (data) => client.post('/user/login', data);

export const logout = (refreshToken) => client.post('/user/logout', { refreshToken });

export const forgotPassword = (email) => client.post('/user/forgot-password', { email });
