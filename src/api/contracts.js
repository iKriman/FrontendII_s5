import { isDate, nightCount } from '../lib/travel.js';
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const id = (value) => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
const count = (value) => Number.isSafeInteger(value) && value >= 0;
export const isDestination = (value) =>
  Boolean(
    value &&
    id(value.id) &&
    text(value.name) &&
    text(value.country) &&
    text(value.region) &&
    text(value.tagline) &&
    text(value.description) &&
    text(value.airport) &&
    ['desert', 'mountain', 'andes', 'beach', 'city', 'island'].includes(value.scene) &&
    Array.isArray(value.activities) &&
    value.activities.length > 0 &&
    value.activities.every(text),
  );
export const isDestinations = (value) =>
  Array.isArray(value) &&
  value.every(isDestination) &&
  new Set(value.map((item) => item.id)).size === value.length;
export const isFlight = (value) =>
  Boolean(
    value &&
    id(value.id) &&
    id(value.destinationId) &&
    text(value.airline) &&
    text(value.origin) &&
    text(value.arrival) &&
    text(value.departureDate) &&
    text(value.returnDate) &&
    text(value.departureTime) &&
    count(value.durationMinutes) &&
    count(value.stops) &&
    count(value.price) &&
    value.price > 0 &&
    count(value.seatsAvailable) &&
    typeof value.available === 'boolean',
  );
export const isHotel = (value) =>
  Boolean(
    value &&
    id(value.id) &&
    id(value.destinationId) &&
    text(value.name) &&
    count(value.stars) &&
    value.stars <= 5 &&
    text(value.location) &&
    count(value.nightlyPrice) &&
    value.nightlyPrice > 0 &&
    text(value.checkIn) &&
    text(value.checkOut) &&
    count(value.capacity) &&
    count(value.roomsAvailable) &&
    typeof value.available === 'boolean' &&
    Array.isArray(value.amenities) &&
    value.amenities.every(text),
  );
export const validOptions = (value) =>
  Boolean(
    value &&
    id(value.destinationId) &&
    isDate(value.departureDate) &&
    isDate(value.returnDate) &&
    value.nights === nightCount(value.departureDate, value.returnDate) &&
    value.nights >= 1 &&
    Number.isInteger(value.travelers) &&
    value.travelers >= 1 &&
    value.travelers <= 4 &&
    (value.flights === null ||
      (Array.isArray(value.flights) &&
        value.flights.every(
          (item) =>
            isFlight(item) &&
            item.destinationId === value.destinationId &&
            item.departureDate === value.departureDate &&
            item.returnDate === value.returnDate &&
            item.available === item.seatsAvailable >= value.travelers,
        ))) &&
    (value.hotels === null ||
      (Array.isArray(value.hotels) &&
        value.hotels.every(
          (item) =>
            isHotel(item) &&
            item.destinationId === value.destinationId &&
            item.checkIn === value.departureDate &&
            item.checkOut === value.returnDate &&
            item.available === (item.capacity >= value.travelers && item.roomsAvailable > 0),
        ))),
  );
