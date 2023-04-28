import mongoose from "mongoose";
//checking if the connection already exist and if not connecting to mongodb
export function mongooseConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }
}
