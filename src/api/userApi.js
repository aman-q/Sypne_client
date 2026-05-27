import client from './client';

export const getProfile = () => client.get('/user/profile/me').then((r) => r.data);

export const getMyBookings = () => client.get('/user/profile/me/bookings').then((r) => r.data);

export const updateProfile = (data) => client.patch('/user/profile/me', data).then((r) => r.data);
