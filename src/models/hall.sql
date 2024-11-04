CREATE TABLE halls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  seat_config JSONB
);

INSERT INTO halls (name, capacity, seat_config) VALUES
('Hall A', 5, '{"rows": 1, "cols": 5}'),
('Hall B', 10, '{"rows": 2, "cols": 5}'),
('Hall C', 15, '{"rows": 3, "cols": 5}');