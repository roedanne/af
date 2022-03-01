import mongoose from 'mongoose';
import PointSchema from './point'
/*
interface ContainedArticle {
  art_id: number;
  amount_of: number;
}
*/

/*

mytestuser
4teStAFpwd

mongodb+srv://mytestuser:4teStAFpwd@cluster0.wryos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


*/


export interface User extends mongoose.Document {
  user_id: number,
  name: string,
  //contain_articles: ContainedArticle[];
  location: typeof PointSchema;
}

const schema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: [true, 'Please enter a user ID'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter a user name'],
      index: true,
    },
    location: {
      type: PointSchema,
      required: true,
      index: '2dsphere'
    },

  },
  { timestamps: true },
);

export const UserModel = mongoose.model<User>('User', schema);
