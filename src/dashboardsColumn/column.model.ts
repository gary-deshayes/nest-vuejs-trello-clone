import * as mongoose from 'mongoose';
import { Card } from 'src/dashboardsCard/card.model';

export const ColumnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: false },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
});

export interface Column extends mongoose.Document {
  id: string;
  name: string;
  color: string;
  dashboard_id?: string;
  cards?: Array<Card>;
}
