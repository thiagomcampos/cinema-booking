import { Schema, model } from "mongoose";

const reservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  session: { type: Number, ref: "Session" },
  seats: [Number],
});

const Reservation = model("Reservation", reservationSchema);

export default Reservation;
