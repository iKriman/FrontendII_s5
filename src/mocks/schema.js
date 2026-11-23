import { buildSchema, GraphQLError } from 'graphql';
import { destinations } from './data.js';
import { validateSearch, nightCount } from '../lib/travel.js';
export const schema = buildSchema(`
  type Flight { id: ID!, destinationId: ID!, airline: String!, origin: String!, arrival: String!, departureDate: String!, returnDate: String!, departureTime: String!, durationMinutes: Int!, stops: Int!, price: Int!, seatsAvailable: Int!, available: Boolean! }
  type Hotel { id: ID!, destinationId: ID!, name: String!, stars: Int!, location: String!, nightlyPrice: Int!, checkIn: String!, checkOut: String!, capacity: Int!, roomsAvailable: Int!, available: Boolean!, amenities: [String!]! }
  type TravelOptions { destinationId: ID!, departureDate: String!, returnDate: String!, travelers: Int!, nights: Int!, flights: [Flight!], hotels: [Hotel!] }
  type Query { travelOptions(destinationId: ID!, departureDate: String!, returnDate: String!, travelers: Int!): TravelOptions }
`);
export function resolveOptions(args, scenario = '') {
  const destination = destinations.find((item) => item.id === args.destinationId);
  if (!destination)
    throw new GraphQLError('No encontramos el destino seleccionado.', {
      extensions: { code: 'NOT_FOUND' },
    });
  if (Object.keys(validateSearch(args)).length)
    throw new GraphQLError('Revisa las fechas y la cantidad de viajeros.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  const empty = destination.id === 'rapa-nui' || scenario === 'empty';
  const flights = empty
    ? []
    : ['Andes Air', 'Horizonte Sur', 'Vía Pacífico'].map((airline, index) => ({
        id: destination.id + '-flight-' + index,
        destinationId: destination.id,
        airline,
        origin: 'Santiago',
        arrival: destination.airport,
        departureDate: args.departureDate,
        returnDate: args.returnDate,
        departureTime: ['08:30', '13:15', '19:40'][index],
        durationMinutes: destination.duration + index * 45,
        stops: index === 1 ? 1 : 0,
        price: destination.basePrice + index * 35000,
        seatsAvailable: [8, 2, 0][index],
        available: [8, 2, 0][index] >= args.travelers,
      }));
  const hotels = empty
    ? []
    : ['Refugio del Viajero', 'Casa del Horizonte', 'Hotel Mirador'].map((name, index) => ({
        id: destination.id + '-hotel-' + index,
        destinationId: destination.id,
        name,
        stars: [3, 4, 4][index],
        location: ['Cerca del centro', 'Barrio tranquilo', 'Sector panorámico'][index],
        nightlyPrice: destination.hotelBase + index * 20000,
        checkIn: args.departureDate,
        checkOut: args.returnDate,
        capacity: [4, 2, 4][index],
        roomsAvailable: [5, 2, 0][index],
        available: [5, 2, 0][index] > 0 && [4, 2, 4][index] >= args.travelers,
        amenities: [
          ['Wi-Fi', 'Desayuno'],
          ['Wi-Fi', 'Desayuno', 'Piscina'],
          ['Wi-Fi', 'Estacionamiento'],
        ][index],
      }));
  return {
    destinationId: args.destinationId,
    departureDate: args.departureDate,
    returnDate: args.returnDate,
    travelers: args.travelers,
    nights: nightCount(args.departureDate, args.returnDate),
    flights,
    hotels:
      scenario === 'partial'
        ? () => {
            throw new GraphQLError(
              'No pudimos consultar los hoteles. Los vuelos siguen disponibles.',
              { extensions: { code: 'HOTELS_UNAVAILABLE' } },
            );
          }
        : hotels,
  };
}
