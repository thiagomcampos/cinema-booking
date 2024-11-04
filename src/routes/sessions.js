import express from "express";
import { pgPool } from "../config/database.js";
import reservationService from "../services/reservationService.js";
import sessionService from "../services/sessionService.js";

const router = express.Router();

// GET /sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await pgPool.query("SELECT * FROM sessions");
    res.json(sessions.rows);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// GET /sessions/:id/seats
router.get("/:id/seats", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await sessionService.getSession(sessionId);
    const seats = await pgPool.query("SELECT * FROM seats WHERE hall_id = $1", [
      session.hall_id,
    ]);

    const availableSeatsResult = await pgPool.query(
      "SELECT seats FROM sessions WHERE id = $1",
      [sessionId]
    );
    const availableSeats = availableSeatsResult.rows[0].seats;

    const seatsWithStatus = seats.rows.map((seat) => ({
      ...seat,
      isReserved: !availableSeats.includes(seat.seat_number),
    }));

    res.json(seatsWithStatus);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});

// POST /sessions/:id/seats/reserve
router.post("/:id/seats/reserve", async (req, res) => {
  try {
    const reservation = await reservationService.reserveSeats(
      req.params.id,
      req.body.userId,
      req.body.seats
    );
    res.json(reservation);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
});

export default router;
