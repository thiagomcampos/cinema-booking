import { pgPool } from "../config/database.js";

const getSession = async (sessionId) => {
  const result = await pgPool.query("SELECT * FROM sessions WHERE id = $1", [
    sessionId,
  ]);
  return result.rows[0];
};

export default {
  getSession,
};
