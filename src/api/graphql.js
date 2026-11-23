import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
export const TRAVEL_OPTIONS = gql`
  query TravelOptions(
    $destinationId: ID!
    $departureDate: String!
    $returnDate: String!
    $travelers: Int!
  ) {
    travelOptions(
      destinationId: $destinationId
      departureDate: $departureDate
      returnDate: $returnDate
      travelers: $travelers
    ) {
      destinationId
      departureDate
      returnDate
      travelers
      nights
      flights {
        id
        destinationId
        airline
        origin
        arrival
        departureDate
        returnDate
        departureTime
        durationMinutes
        stops
        price
        seatsAvailable
        available
      }
      hotels {
        id
        destinationId
        name
        stars
        location
        nightlyPrice
        checkIn
        checkOut
        capacity
        roomsAvailable
        available
        amenities
      }
    }
  }
`;
export function createApollo({ uri, scenario = '', fetchImpl = fetch }) {
  return new ApolloClient({
    link: new HttpLink({
      uri,
      fetch: fetchImpl,
      headers: scenario ? { 'x-demo-scenario': scenario } : {},
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Flight: { keyFields: false },
        Hotel: { keyFields: false },
        TravelOptions: { keyFields: false },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    },
  });
}
