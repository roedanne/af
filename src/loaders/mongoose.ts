import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config'

export default async (): Promise<Db> => {

// Open the mongoose connection
const connection = await mongoose.connect(config.databaseURL);
  return connection.connection.db;
};
