import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
  reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
});

const User = model("User", userSchema);

export default User;
