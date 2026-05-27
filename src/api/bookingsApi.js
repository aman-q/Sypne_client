import client from './client';

export const createBooking = (data) => client.post('/booking/new-booking', data);

export const cancelBooking = (id) => client.post(`/booking/cancel/${id}`);
