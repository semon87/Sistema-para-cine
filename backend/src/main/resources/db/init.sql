-- Creación de la base de datos (ejecutar como superusuario postgres)
-- CREATE DATABASE cinereservas;

-- Conectar a la base de datos
\c cinereservas

-- Creación de tablas
-- Tabla de películas
CREATE TABLE movies (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        genre VARCHAR(50) NOT NULL,
                        allowed_age SMALLINT NOT NULL,
                        length_minutes SMALLINT NOT NULL,
                        status BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de salas
CREATE TABLE rooms (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL,
                       number SMALLINT NOT NULL,
                       status BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de butacas
CREATE TABLE seats (
                       id SERIAL PRIMARY KEY,
                       number SMALLINT NOT NULL,
                       row_number SMALLINT NOT NULL,
                       room_id INT NOT NULL,
                       status BOOLEAN NOT NULL DEFAULT TRUE,
                       CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Tabla de clientes
CREATE TABLE customers (
                           id SERIAL PRIMARY KEY,
                           document_number VARCHAR(20) NOT NULL UNIQUE,
                           name VARCHAR(30) NOT NULL,
                           lastname VARCHAR(30) NOT NULL,
                           age SMALLINT NOT NULL,
                           phone_number VARCHAR(20),
                           email VARCHAR(100),
                           status BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de cartelera
CREATE TABLE billboards (
                            id SERIAL PRIMARY KEY,
                            date DATE NOT NULL,
                            start_time TIME NOT NULL,
                            end_time TIME NOT NULL,
                            movie_id INT NOT NULL,
                            room_id INT NOT NULL,
                            status BOOLEAN NOT NULL DEFAULT TRUE,
                            CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movies(id),
                            CONSTRAINT fk_room_billboard FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Tabla de reservas
CREATE TABLE bookings (
                          id SERIAL PRIMARY KEY,
                          date DATE NOT NULL,
                          customer_id INT NOT NULL,
                          seat_id INT NOT NULL,
                          billboard_id INT NOT NULL,
                          status BOOLEAN NOT NULL DEFAULT TRUE,
                          CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
                          CONSTRAINT fk_seat FOREIGN KEY (seat_id) REFERENCES seats(id),
                          CONSTRAINT fk_billboard FOREIGN KEY (billboard_id) REFERENCES billboards(id)
);

-- Inserción de datos de prueba
-- Películas
INSERT INTO movies (name, genre, allowed_age, length_minutes) VALUES
                                                                  ('Aventuras Cósmicas', 'SCIENCE_FICTION', 12, 120),
                                                                  ('El Misterio del Bosque', 'THRILLER', 16, 95),
                                                                  ('Amor en París', 'ROMANCE', 12, 110),
                                                                  ('Superhéroes Unidos', 'ACTION', 12, 140),
                                                                  ('Risas Aseguradas', 'COMEDY', 7, 90),
                                                                  ('Terror en la Oscuridad', 'HORROR', 18, 105);

-- Salas
INSERT INTO rooms (name, number) VALUES
                                     ('Sala Normal', 1),
                                     ('Sala 3D', 2),
                                     ('Sala VIP', 3);

-- Butacas (generadas para cada sala)
-- Sala 1
DO $$
DECLARE
row_counter INT;
    seat_counter INT;
BEGIN
FOR row_counter IN 1..6 LOOP -- Filas A-F
        FOR seat_counter IN 1..10 LOOP -- Asientos 1-10
            INSERT INTO seats (number, row_number, room_id)
            VALUES (seat_counter, row_counter, 1);
END LOOP;
END LOOP;
END $$;

-- Sala 2
DO $$
DECLARE
row_counter INT;
    seat_counter INT;
BEGIN
FOR row_counter IN 1..6 LOOP -- Filas A-F
        FOR seat_counter IN 1..10 LOOP -- Asientos 1-10
            INSERT INTO seats (number, row_number, room_id)
            VALUES (seat_counter, row_counter, 2);
END LOOP;
END LOOP;
END $$;

-- Sala 3 (menos asientos por ser VIP)
DO $$
DECLARE
row_counter INT;
    seat_counter INT;
BEGIN
FOR row_counter IN 1..5 LOOP -- Filas A-E
        FOR seat_counter IN 1..8 LOOP -- Asientos 1-8
            INSERT INTO seats (number, row_number, room_id)
            VALUES (seat_counter, row_counter, 3);
END LOOP;
END LOOP;
END $$;

-- Clientes
INSERT INTO customers (document_number, name, lastname, age, phone_number, email) VALUES
                                                                                      ('123456789', 'Juan', 'Pérez', 30, '555-123-4567', 'juan@example.com'),
                                                                                      ('987654321', 'María', 'González', 25, '555-987-6543', 'maria@example.com'),
                                                                                      ('456789123', 'Carlos', 'Rodríguez', 40, '555-456-7891', 'carlos@example.com');

-- Cartelera para los próximos 7 días
DO $$
DECLARE
day_counter INT;
    movie_counter INT;
    room_counter INT;
    start_times TEXT[] := ARRAY['14:30', '17:00', '19:30', '22:00'];
    start_time TEXT;
    end_time TIME;
current_date DATE := CURRENT_DATE;
    billboard_date DATE;
    movie_length INT;
    movie_id INT;
    room_id INT;
BEGIN
FOR day_counter IN 0..6 LOOP -- Próximos 7 días
        billboard_date := current_date + day_counter;

FOR room_counter IN 1..3 LOOP -- 3 salas
            room_id := room_counter;

FOR movie_counter IN 1..4 LOOP -- 4 funciones por día
                -- Película aleatoria
                movie_id := (movie_counter % 6) + 1;

                -- Obtener la duración de la película
SELECT length_minutes INTO movie_length FROM movies WHERE id = movie_id;

-- Hora de inicio
start_time := start_times[movie_counter];

                -- Calcular hora de fin
                end_time := (start_time::TIME + (movie_length || ' minutes')::INTERVAL)::TIME;

                -- Insertar en la cartelera
INSERT INTO billboards (date, start_time, end_time, movie_id, room_id)
VALUES (billboard_date, start_time::TIME, end_time, movie_id, room_id);
END LOOP;
END LOOP;
END LOOP;
END $$;

-- Algunas reservas de ejemplo
DO $$
DECLARE
billboard_id INT;
    customer_id INT;
    seat_id INT;
    counter INT;
BEGIN
FOR counter IN 1..20 LOOP
        -- Seleccionar una cartelera aleatoria
SELECT id INTO billboard_id FROM billboards ORDER BY RANDOM() LIMIT 1;

-- Seleccionar un cliente aleatorio
customer_id := (counter % 3) + 1;

        -- Seleccionar una butaca aleatoria para la sala de esa cartelera
SELECT s.id INTO seat_id
FROM seats s
         JOIN billboards b ON s.room_id = b.room_id
WHERE b.id = billboard_id AND s.status = TRUE
ORDER BY RANDOM() LIMIT 1;

-- Si encontramos una butaca disponible, crear la reserva
IF seat_id IS NOT NULL THEN
            INSERT INTO bookings (date, customer_id, seat_id, billboard_id)
            VALUES (CURRENT_DATE - (counter % 14), customer_id, seat_id, billboard_id);

            -- Marcar la butaca como ocupada
UPDATE seats SET status = FALSE WHERE id = seat_id;
END IF;
END LOOP;
END $$;

-- Crear vistas útiles
-- Vista de cartelera con información completa
CREATE VIEW v_billboard_details AS
SELECT
    b.id,
    b.date,
    b.start_time,
    b.end_time,
    b.status,
    m.id AS movie_id,
    m.name AS movie_name,
    m.genre AS movie_genre,
    m.allowed_age,
    r.id AS room_id,
    r.name AS room_name
FROM billboards b
         JOIN movies m ON b.movie_id = m.id
         JOIN rooms r ON b.room_id = r.id;

-- Vista de reservas con información completa
CREATE VIEW v_booking_details AS
SELECT
    bk.id,
    bk.date,
    bk.status,
    c.id AS customer_id,
    c.name || ' ' || c.lastname AS customer_name,
    c.document_number,
    s.id AS seat_id,
    s.number AS seat_number,
    s.row_number,
    CASE
        WHEN s.row_number = 1 THEN 'A'
        WHEN s.row_number = 2 THEN 'B'
        WHEN s.row_number = 3 THEN 'C'
        WHEN s.row_number = 4 THEN 'D'
        WHEN s.row_number = 5 THEN 'E'
        WHEN s.row_number = 6 THEN 'F'
        END || s.number AS seat_label,
    b.id AS billboard_id,
    m.name AS movie_name,
    r.name AS room_name
FROM bookings bk
         JOIN customers c ON bk.customer_id = c.id
         JOIN seats s ON bk.seat_id = s.id
         JOIN billboards b ON bk.billboard_id = b.id
         JOIN movies m ON b.movie_id = m.id
         JOIN rooms r ON b.room_id = r.id;

-- Vista para contar asientos disponibles y ocupados por sala y cartelera
CREATE VIEW v_seat_availability AS
SELECT
    b.id AS billboard_id,
    b.date,
    r.id AS room_id,
    r.name AS room_name,
    COUNT(s.id) AS total_seats,
    COUNT(bk.id) AS occupied_seats,
    COUNT(s.id) - COUNT(bk.id) AS available_seats
FROM billboards b
         JOIN rooms r ON b.room_id = r.id
         JOIN seats s ON s.room_id = r.id
         LEFT JOIN bookings bk ON bk.seat_id = s.id AND bk.billboard_id = b.id AND bk.status = TRUE
WHERE s.status = TRUE AND b.status = TRUE AND r.status = TRUE
GROUP BY b.id, b.date, r.id, r.name;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_billboards_date ON billboards(date);
CREATE INDEX idx_billboards_movie_id ON billboards(movie_id);
CREATE INDEX idx_billboards_room_id ON billboards(room_id);
CREATE INDEX idx_seats_room_id ON seats(room_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_billboard_id ON bookings(billboard_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_movies_genre ON movies(genre);