import * as mongoose from 'mongoose';

export const DashboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  columns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
});

export interface Dashboard extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  columns: Array<object>;
}
