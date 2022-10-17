import { Body, Controller, Post } from '@nestjs/common';
import { Card, CardSchema } from './card.model';
import { CardsService } from './cards.service';

@Controller('dashboard/card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCard(
    @Body('card') card: Card,
    @Body('column_id') columnId: string,
  ) {
    this.cardsService.createCard(card, columnId);
  }
}
