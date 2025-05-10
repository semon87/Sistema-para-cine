// frontend/src/components/MovieList.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid as MuiGrid,
    CircularProgress,
    Chip,
    Button,
    useTheme,
    alpha,
    Fade,
    Grow,
    IconButton,
    Tab,
    Tabs,
    Divider,
    Paper,
} from '@mui/material';
import MovieCard from './MovieCard';
import { useReservation } from '../context/ReservationContext';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

// Géneros para filtrar
const genres = [
    'ALL',
    'SCIENCE_FICTION',
    'THRILLER',
    'ROMANCE',
    'ACTION',
    'COMEDY',
    'HORROR',
    'FANTASY',
    'ADVENTURE',
    'DRAMA',
    'MUSICALS',
];

// Función para formatear nombres de género
const formatGenre = (genre: string) => {
    if (genre === 'ALL') return 'Todos';
    return genre.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
};

const movieDirectors: Record<string, string> = {
    'Aventuras Cósmicas': 'Ana Martínez',
    'El Misterio del Bosque': 'Carlos López',
    'Amor en París': 'María González',
    'Superhéroes Unidos': 'Roberto Sánchez',
    'Risas Aseguradas': 'Laura Rodríguez',
    'Terror en la Oscuridad': 'Daniel Murillo',
    'Mundos Paralelos': 'Gabriela Torres',
    'El Código Secreto': 'Pablo Moreno',
    'Fantasía Medieval': 'Elena Castro',
    'La Gran Aventura': 'Luis Ramírez',
    'Lazos Eternos': 'Marina Suárez',
    'Melodías del Corazón': 'Alejandro Méndez'
};

const MovieList = () => {
    const { movies, fetchMovies } = useReservation();
    const [loading, setLoading] = useState(true);
    const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('ALL');
    const [showGrid, setShowGrid] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    // Cargar películas al inicio
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            await fetchMovies();
            setLoading(false);
        };

        loadMovies();
    }, [fetchMovies]);

    // Filtrar películas por género seleccionado
    useEffect(() => {
        if (movies.length === 0) return;

        if (selectedGenre === 'ALL') {
            setFilteredMovies(movies);
        } else {
            const filtered = movies.filter(movie => movie.genre === selectedGenre);
            setFilteredMovies(filtered);
        }
    }, [movies, selectedGenre]);

    // Manejar el cambio de género
    const handleGenreChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedGenre(newValue);
    };

    // Manejar el desplazamiento horizontal de la lista de películas
    const handleScroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const scrollAmount = direction === 'left' ? -600 : 600;
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Box
            sx={{
                py: { xs: 8, md: 10 },
                background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.9)}, ${theme.palette.background.default})`,
                position: 'relative',
                overflow: 'hidden',
            }}
            id="peliculas"
        >
            {/* Elementos decorativos de fondo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 70%)`,
                    zIndex: 0,
                }}
            />

            <Container maxWidth="xl">
                {/* Encabezado de la sección */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 5,
                    position: 'relative',
                    zIndex: 2,
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocalMoviesIcon
                                color="secondary"
                                fontSize="large"
                                sx={{ mr: 2 }}
                            />
                            <Typography
                                variant="h3"
                                component="h2"
                                fontWeight="900"
                                sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    position: 'relative',
                                }}
                            >
                                Películas en Cartelera
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        height: '5px',
                                        width: '60px',
                                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}, transparent)`,
                                        bottom: -10,
                                        left: 0,
                                        borderRadius: '10px',
                                    }}
                                />
                            </Typography>
                        </Box>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mt: 2 }}
                        >
                            Descubre nuestro catálogo de películas y sumérgete en historias fascinantes.
                            Filtrar por género para encontrar exactamente lo que estás buscando.
                        </Typography>
                    </Box>
                    <Box sx={{
                        mt: { xs: 2, md: 0 },
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Button
                            variant={showGrid ? "outlined" : "contained"}
                            color="secondary"
                            onClick={() => setShowGrid(false)}
                            sx={{
                                mr: 1,
                                borderRadius: showGrid ? '8px' : '20px',
                                transition: 'all 0.3s',
                                boxShadow: showGrid ? 'none' : 3,
                            }}
                        >
                            Lista
                        </Button>
                        <Button
                            variant={showGrid ? "contained" : "outlined"}
                            color="secondary"
                            onClick={() => setShowGrid(true)}
                            sx={{
                                borderRadius: showGrid ? '20px' : '8px',
                                transition: 'all 0.3s',
                                boxShadow: showGrid ? 3 : 'none',
                            }}
                        >
                            Cuadrícula
                        </Button>
                    </Box>
                </Box>

                {/* Tabs para filtrar por género */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 5,
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <Box sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        px: { xs: 2, md: 4 },
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <FilterListIcon color="primary" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }} />
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mr: 3,
                                fontWeight: 'bold',
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            Filtrar por:
                        </Typography>
                        <Tabs
                            value={selectedGenre}
                            onChange={handleGenreChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="movie genre tabs"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: theme.palette.secondary.main,
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    mx: 0.5,
                                    '&.Mui-selected': {
                                        color: theme.palette.secondary.main,
                                        fontWeight: 'bold',
                                    },
                                },
                            }}
                        >
                            {genres.map((genre) => (
                                <Tab
                                    key={genre}
                                    label={formatGenre(genre)}
                                    value={genre}
                                    disableRipple
                                />
                            ))}
                        </Tabs>
                    </Box>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    // Vista Grid o Carrusel según la selección
                    showGrid ? (
                        // Grid View
                        <Grid container spacing={4}>
                            {filteredMovies.map((movie, index) => (
                                <Grow
                                    in={true}
                                    style={{ transformOrigin: '0 0 0' }}
                                    timeout={300 + (index * 100)}
                                    key={movie.id}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={4}
                                    >
                                        <MovieCard
                                            id={movie.id}
                                            title={movie.name}
                                            duration={`${movie.lengthMinutes} minutos`}
                                            genre={movie.genre}
                                            director={movieDirectors[movie.name] || 'Director'}
                                            image={`/api/placeholder/400/300`}
                                        />
                                    </Grid>
                                </Grow>
                            ))}
                        </Grid>
                    ) : (
                        // Lista horizontal (Carousel View)
                        <Box sx={{ position: 'relative', mt: 2 }}>
                            <Box sx={{
                                position: 'absolute',
                                left: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 3,
                                display: { xs: 'none', md: 'block' }
                            }}>
                                <IconButton
                                    onClick={() => handleScroll('left')}
                                    sx={{
                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                        boxShadow: 3,
                                        '&:hover': {
                                            bgcolor: theme.palette.background.paper,
                                        }
                                    }}
                                >
                                    <NavigateBeforeIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{
                                position: 'absolute',
                                right: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 3,
                                display: { xs: 'none', md: 'block' }
                            }}>
                                <IconButton
                                    onClick={() => handleScroll('right')}
                                    sx={{
                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                        boxShadow: 3,
                                        '&:hover': {
                                            bgcolor: theme.palette.background.paper,
                                        }
                                    }}
                                >
                                    <NavigateNextIcon />
                                </IconButton>
                            </Box>
                            <Box
                                ref={containerRef}
                                sx={{
                                    display: 'flex',
                                    overflowX: 'auto',
                                    pb: 2,
                                    px: 2,
                                    scrollbarWidth: 'none', // Para Firefox
                                    '&::-webkit-scrollbar': { // Para Chrome, Safari y Opera
                                        display: 'none'
                                    },
                                    '-ms-overflow-style': 'none', // Para IE y Edge
                                    scrollSnapType: 'x mandatory',
                                }}
                            >
                                {filteredMovies.map((movie, index) => (
                                    <Fade in key={movie.id} timeout={500 + (index * 100)}>
                                        <Box
                                            sx={{
                                                flexShrink: 0,
                                                width: { xs: '90%', sm: '45%', md: '30%' },
                                                pr: 2,
                                                scrollSnapAlign: 'start',
                                            }}
                                        >
                                            <MovieCard
                                                id={movie.id}
                                                title={movie.name}
                                                duration={`${movie.lengthMinutes} minutos`}
                                                genre={movie.genre}
                                                director={movieDirectors[movie.name] || 'Director'}
                                                image={`/api/placeholder/400/300`}
                                            />
                                        </Box>
                                    </Fade>
                                ))}
                            </Box>
                            <Box sx={{
                                justifyContent: 'center',
                                mt: 4,
                                display: { xs: 'flex', md: 'none' }
                            }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => handleScroll('right')}
                                >
                                    Ver más películas
                                </Button>
                            </Box>
                        </Box>
                    )
                )}

                {/* Estadísticas al final (opcional) */}
                {!loading && filteredMovies.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            fontSize: '0.875rem'
                        }}
                    >
                        Mostrando {filteredMovies.length} de {movies.length} películas
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default MovieList;