import React from 'react';
import { Routes, Route } from 'react-router';
import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Destination from './pages/Destination';
import MyTrip from './pages/MyTrip';
import NotFound from './pages/NotFound';
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="destinos" element={<Destinations />} />
        <Route path="destinos/:destinationId" element={<Destination />} />
        <Route path="mi-viaje" element={<MyTrip />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
