import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import SeatSelection from './components/SeatSelection';
import AdminButaca from './components/AdminButaca';
import AdminCartelera from './components/AdminCartelera';
import ReservationList from './components/ReservationList';
import Footer from './components/Footer';
import { ReservationProvider } from './context/ReservationContext';

function App() {
    return (
        <ReservationProvider>
            <Router>
                <CssBaseline />
                <Box>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={
                            <>
                                <HeroSection />
                                <MovieList />
                            </>
                        } />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/select-seats/:billboardId" element={<SeatSelection />} />
                        <Route path="/admin/seats" element={<AdminButaca />} />
                        <Route path="/admin/billboard" element={<AdminCartelera />} />
                        <Route path="/reservations" element={<ReservationList />} />
                    </Routes>
                    <Footer />
                </Box>
            </Router>
        </ReservationProvider>
    );
}

export default App;