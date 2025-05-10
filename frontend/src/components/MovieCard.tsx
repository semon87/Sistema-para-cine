// frontend/src/components/MovieCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Stack,
    Chip,
    useTheme,
    alpha,
    IconButton,
    Skeleton,
    Tooltip,
    Rating,
    Collapse,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import DirectorChairIcon from '@mui/icons-material/Chair';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface MovieCardProps {
    id: number;
    title: string;
    duration: string;
    genre: string;
    director: string;
    image: string;
}

const MovieCard = ({ id, title, duration, genre, director, image }: MovieCardProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Generar rating aleatorio entre 3.5 y 5
    const rating = Math.random() * 1.5 + 3.5;

    const handleReserveClick = () => {
        navigate(`/movie/${id}`);
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    // Mapa de imágenes según el género para proporcionar imágenes relevantes
    const genreImages: Record<string, string> = {
        'SCIENCE_FICTION': 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1200&h=400&auto=format&fit=crop', // Futurista
        'THRILLER': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&h=400&auto=format&fit=crop', // Suspenso
        'ROMANCE': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&h=400&auto=format&fit=crop', // Pareja
        'ACTION': 'https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=1200&h=400&auto=format&fit=crop', // Explosión
        'COMEDY': 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=1200&h=400&auto=format&fit=crop', // Risa
        'HORROR': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&h=400&auto=format&fit=crop', // Oscuro
        'DRAMA': 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&h=400&auto=format&fit=crop', // Teatro
        'FANTASY': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=1200&h=400&auto=format&fit=crop', // Dragón
        'ADVENTURE': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&h=400&auto=format&fit=crop', // Montañas
        'MUSICALS': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&h=400&auto=format&fit=crop', // Música
    };

    // Determinar la imagen basada en el género, o usar una predeterminada
    const movieImage = genre && genreImages[genre] ? genreImages[genre] : image;

    // Géneros traducidos para mostrar en pantalla
    const genreTranslations: Record<string, string> = {
        'SCIENCE_FICTION': 'Ciencia Ficción',
        'THRILLER': 'Suspense',
        'ROMANCE': 'Romance',
        'ACTION': 'Acción',
        'COMEDY': 'Comedia',
        'HORROR': 'Terror',
        'DRAMA': 'Drama',
        'FANTASY': 'Fantasía',
        'ADVENTURE': 'Aventura',
        'MUSICALS': 'Musical'
    };

    // Obtener la traducción del género o mostrar el original
    const displayGenre = genreTranslations[genre] || genre.replace('_', ' ');

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: isHovered
                    ? `0 16px 70px -12px ${alpha(theme.palette.primary.main, 0.3)}, 0 8px 16px -8px ${alpha(theme.palette.common.black, 0.2)}`
                    : `0 6px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                position: 'relative',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}`,
                    pointerEvents: 'none',
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Información adicional que aparece al hacer hover */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            >
                <Tooltip title="Más información">
                    <IconButton
                        size="small"
                        onClick={handleExpandClick}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Insignia de género */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    transition: 'all 0.3s ease-in-out',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
            >
                <Chip
                    label={displayGenre}
                    size="small"
                    color="secondary"
                    sx={{
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        bgcolor: alpha(theme.palette.secondary.main, 0.9),
                        backdropFilter: 'blur(4px)',
                    }}
                />
            </Box>

            {/* Imagen de portada */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                {!imageLoaded && (
                    <Skeleton
                        variant="rectangular"
                        height={300}
                        animation="wave"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                    />
                )}
                <CardMedia
                    component="img"
                    height="300"
                    image={movieImage}
                    alt={title}
                    onLoad={() => setImageLoaded(true)}
                    sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease-in-out',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                />
                {/* Overlay al pasar el mouse */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.8)} 0%, ${alpha(theme.palette.common.black, 0.2)} 30%, transparent 60%)`,
                        opacity: isHovered ? 1 : 0.7,
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                />
                {/* Calificación flotante */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(4px)',
                        borderRadius: '12px',
                        px: 1,
                        py: 0.5,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="caption" fontWeight="bold">
                        {rating.toFixed(1)}
                    </Typography>
                </Box>
            </Box>

            {/* Contenido principal */}
            <CardContent sx={{ flexGrow: 1, pt: 2, pb: 2, px: 3 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        mb: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '3.5rem',
                    }}
                >
                    {title}
                </Typography>

                {/* Collapse para info extra */}
                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {genre === 'COMEDY' && 'Una comedia hilarante que te hará reír sin parar. Perfecta para disfrutar en familia o con amigos.'}
                        {genre === 'SCIENCE_FICTION' && 'Una aventura futurista que desafía los límites de la imaginación, con efectos visuales sorprendentes.'}
                        {genre === 'THRILLER' && 'Un thriller apasionante que te mantendrá al borde de tu asiento hasta el final inesperado.'}
                        {genre === 'ROMANCE' && 'Una historia de amor que trasciende el tiempo y el espacio, tocando lo más profundo del corazón.'}
                        {genre === 'ACTION' && 'Adrenalina pura con escenas de acción trepidantes y efectos especiales de primera categoría.'}
                        {genre === 'HORROR' && 'Una experiencia aterradora que pondrá a prueba tus nervios y te dejará sin aliento.'}
                        {genre === 'DRAMA' && 'Un drama conmovedor que explora la complejidad de las relaciones humanas y las emociones.'}
                        {genre === 'FANTASY' && 'Un mundo de fantasía donde la magia y la aventura te transportan a lugares increíbles.'}
                        {genre === 'ADVENTURE' && 'Una aventura épica llena de desafíos, descubrimientos y paisajes impresionantes.'}
                        {genre === 'MUSICALS' && 'Un espectáculo musical con canciones pegadizas y coreografías espectaculares.'}
                    </Typography>
                </Collapse>

                {/* Información básica */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {duration}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MovieFilterIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {displayGenre}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectorChairIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {director}
                        </Typography>
                    </Box>
                </Stack>

                {/* Botón de reserva */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ConfirmationNumberIcon />}
                    fullWidth
                    onClick={handleReserveClick}
                    sx={{
                        borderRadius: '30px',
                        py: 1,
                        fontWeight: 'bold',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }
                    }}
                >
                    Reservar
                </Button>
            </CardContent>
        </Card>
    );
};

export default MovieCard;