import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from './card.model';
import { Column } from 'src/dashboardsColumn/column.model';
import { Dashboard } from 'src/dashboards/dashboard.model';
import { Model } from 'mongoose';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel('Card') private readonly cardModel: Model<Card>,
    @InjectModel('Column') private readonly columnModel: Model<Column>,
    @InjectModel('Dashboard') private readonly dashboardModel: Model<Dashboard>,
  ) {}

  async createCard(card: Card, columnId: string) {
    const newCard = new this.cardModel(card);
    newCard.save().then(async (result) => {
      console.log(result);

      const column = await this.columnModel.findById(columnId);
      if (!column) {
        throw new NotFoundException('Impossible de trouver ce dashboard');
        newCard.remove();
      }
      column.cards.push(newCard._id);
      await column.save();
      return column;
    });
  }
}
