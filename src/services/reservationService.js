import { pgPool } from "../config/database.js";
import Reservation from "../models/reservation.js";
import mongoose from "mongoose";
import kpiService from "./kpiService.js";

const reserveSeats = async (sessionId, userId, seatsToReserve) => {
  try {
    kpiService.trackReservationAttempt();
    kpiService.trackConcurrency();
    const startTime = Date.now();
    await pgPool.query("BEGIN");

    const sessionResult = await pgPool.query(
      "SELECT * FROM sessions WHERE id = $1",
      [sessionId]
    );
    const session = sessionResult.rows[0];
    if (!session) {
      throw new Error("Session not found");
    }

    if (
      !seatsToReserve.every((seat) =>
        session.seats.map(String).includes(String(seat))
      )
    ) {
      throw new Error("Some seats are not available");
    }

    const updatedSeats = session.seats.filter(
      (seat) =>
        !seatsToReserve.some((reserved) => String(reserved) === String(seat))
    );

    const updateResult = await pgPool.query(
      "UPDATE sessions SET seats = $1, version = version + 1 WHERE id = $2 AND version = $3 RETURNING *",
      [JSON.stringify(updatedSeats), sessionId, session.version]
    );

    if (updateResult.rowCount === 0) {
      await pgPool.query("ROLLBACK");
      throw new Error("Seats already booked");
    }

    const reservation = new Reservation({
      user: mongoose.Types.ObjectId.createFromTime(userId),
      session: sessionId,
      seats: seatsToReserve,
    });
    await reservation.save();

    await pgPool.query("COMMIT");
    kpiService.trackSuccessfulReservation();
    kpiService.trackResponseTime(startTime);
    return reservation;
  } catch (error) {
    await pgPool.query("ROLLBACK");
    throw error;
  } finally {
    kpiService.resetConcurrency();
  }
};

export default { reserveSeats };
