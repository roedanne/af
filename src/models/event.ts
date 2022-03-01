import mongoose from 'mongoose';

export interface Event extends mongoose.Document {
  type: string;
  comment: string
  user_id: number;
  task_id: number;
}

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please enter an event type'],
      index: false,
    },

    comment: {
      type: String,
      required: [true, 'Please enter a comment'],
      index: false,
    },

    task_id: {
      type: Number,
      required: [true, 'Please enter a task ID'],
      index: true,
    },

    user_id: {
      type: Number,
      required: [true, 'Please enter a user ID'],
      index: false,
    },


  },
  { timestamps: true },
);

export const EventModel = mongoose.model<Event>('Event', schema);
