import pg from "pg";
import { connect, disconnect } from "mongoose";
import path from "path";
import fs from "fs";

const { Pool } = pg;

const connectToPostgres = async (retries = 5, delay = 1000) => {
  try {
    const pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
    await pgPool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL");
    return pgPool;
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    if (retries > 0) {
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectToPostgres(retries - 1, delay * 2);
    } else {
      throw new Error("Failed to connect to PostgreSQL after multiple retries");
    }
  }
};

let pgPool;

(async () => {
  pgPool = await connectToPostgres();
  createTables();
})();

const connectMongoDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/cinema";
    await connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const tableExists = async (tableName) => {
  const result = await pgPool.query(
    `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    )
  `,
    [tableName]
  );
  return result.rows[0].exists;
};

const createTables = async () => {
  try {
    const modelFiles = ["hall.sql", "session.sql", "seat.sql"];
    const __dirname = path.dirname(
      decodeURI(new URL(import.meta.url).pathname).replace(
        /^\/([a-zA-Z]:)/,
        "$1"
      )
    );

    for (const modelFile of modelFiles) {
      const filePath = path.join(__dirname, "..", "models", modelFile);
      const sql = fs.readFileSync(filePath, "utf-8");
      const tableName = sql.match(/CREATE TABLE (\w+)/)[1];

      if (!(await tableExists(tableName))) {
        await pgPool.query(sql);
        console.log(`${tableName} table created`);
      }
    }
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

connectMongoDB();

export { pgPool, connectMongoDB };
