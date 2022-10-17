import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnSchema } from './column.model';
import { DashboardSchema } from 'src/dashboards/dashboard.model';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Column', schema: ColumnSchema }]),
    MongooseModule.forFeature([{ name: 'Dashboard', schema: DashboardSchema }]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
