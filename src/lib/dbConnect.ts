import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("AlredAy Connected ");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log(db, "db==");
    connection.isConnected = db.connections[0].readyState;
    console.log("Db connected ");
  } catch (error) {
    console.log("Db Connecyion Faild", error);
    process.exit();
  }
}

export default dbConnect;
