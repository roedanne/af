import mongoose from 'mongoose';
import PointSchema from './point'

export interface Task extends mongoose.Document {
  type: string;
  state: string;
  employer_id: number;
  assignee_id: number;
  task_id: number;
  location: typeof PointSchema;
}

const schema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: [true, 'Please enter an article name'],
      index: false,
    },

    state: {
      type: String,
      required: [true, 'Please enter a state'],
      default: 'New'
    },

    employer_id: {
      type: Number,
      required: [true, 'Please enter an employer ID'],
      index: true,
    },

    assignee_id: {
      type: Number,
      required: [true, 'Please enter an assignee ID'],
      index: true,
    },

    task_id: {
      type: Number,
      required: [true, 'Please enter an task ID'],
      index: true,
    },

    location: {
      type: PointSchema,
      required: true,
      index: '2dsphere'
    }

  },
  { timestamps: true },
);

// SKAPA INDEX db.places.createIndex( { location: "2dsphere" } )
export const TaskModel = mongoose.model<Task>('Task', schema);
