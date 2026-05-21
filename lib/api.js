const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API = {
  base: BASE_URL,
  cars: `${BASE_URL}/api/cars`,
  bookings: `${BASE_URL}/api/bookings`,
  auth: `${BASE_URL}/api/auth`,
};
