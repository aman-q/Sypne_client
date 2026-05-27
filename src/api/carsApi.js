import client from './client';

export const getAllCars = () =>
  client.get('/cars').then((r) => r.data.cars || []);

export const getUserCars = () =>
  client.get('/cars/usercars').then((r) => r.data.cars || []);

export const getCarById = (id) =>
  client.get(`/cars/${id}`).then((r) => r.data);

export const createCar = (formData) =>
  client.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
