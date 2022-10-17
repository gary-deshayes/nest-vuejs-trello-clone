import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardSchema } from './card.model';
import { ColumnSchema } from 'src/dashboardsColumn/column.model';
import { DashboardSchema } from 'src/dashboards/dashboard.model';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
    MongooseModule.forFeature([{ name: 'Column', schema: ColumnSchema }]),
    MongooseModule.forFeature([{ name: 'Dashboard', schema: DashboardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
