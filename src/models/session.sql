CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  hall_id INT REFERENCES halls(id),
  movie_title VARCHAR(255) NOT NULL,
  showtime TIMESTAMP NOT NULL,
  seats JSONB,
  version INT DEFAULT 0
);

INSERT INTO sessions (hall_id, movie_title, showtime, seats) VALUES
(1, 'Movie 1', '2024-11-04 10:00:00', '[1, 2, 3, 4, 5]'), 
(2, 'Movie 2', '2024-11-04 14:00:00', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]'),
(3, 'Movie 3', '2024-11-04 18:00:00', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]'),
(3, 'Movie 4', '2024-11-05 18:00:00', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]');