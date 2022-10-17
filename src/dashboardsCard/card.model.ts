import * as mongoose from 'mongoose';

export const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
});

export interface Card extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  column_id?: string;
}
