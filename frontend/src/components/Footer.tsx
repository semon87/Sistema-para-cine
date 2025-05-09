// frontend/src/components/Footer.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Link,
    IconButton,
    Stack,
    Divider,
    Grid as MuiGrid,
} from '@mui/material';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'grey.900',
                color: 'white',
                py: 5,
                mt: 'auto'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            CineReservas
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            El mejor sistema de reserva de cine. Fácil, rápido y seguro.
                            Disfruta de las mejores películas con la mejor experiencia.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                color="inherit"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: 'primary.main' }
                                }}
                                size="small"
                                aria-label="facebook"
                            >
                                <FacebookIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: 'primary.main' }
                                }}
                                size="small"
                                aria-label="twitter"
                            >
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: 'primary.main' }
                                }}
                                size="small"
                                aria-label="instagram"
                            >
                                <InstagramIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Enlaces
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Inicio
                            </Link>
                            <Link component={RouterLink} to="/#peliculas" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Películas
                            </Link>
                            <Link component={RouterLink} to="/reservations" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Mis Reservas
                            </Link>
                            <Link component={RouterLink} to="/admin/billboard" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Administración
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Soporte
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Preguntas Frecuentes
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Contacto
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Ayuda
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                                Términos y Condiciones
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Contacto
                        </Typography>
                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center">
                                <LocationIcon sx={{ mr: 1, opacity: 0.7 }} fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Av. Principal 123, Quito, Ecuador
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <PhoneIcon sx={{ mr: 1, opacity: 0.7 }} fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    (+593) 2-123-4567
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <EmailIcon sx={{ mr: 1, opacity: 0.7 }} fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    info@cinereservas.com
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
                    &copy; {currentYear} CineReservas. Todos los derechos reservados.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;