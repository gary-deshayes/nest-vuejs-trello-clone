import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Column } from './column.model';
import { Dashboard } from 'src/dashboards/dashboard.model';
import { Model } from 'mongoose';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('Column') private readonly columnModel: Model<Column>,
    @InjectModel('Dashboard') private readonly dashboardModel: Model<Dashboard>,
  ) {}

  /**
   * Fonction d'ajout d'une colonne
   * @param dashboardId L'id ObjectID du dashboard
   * @param name Le nom de la colonne
   * @param color Sa couleur
   * @returns Une promise contenant le dashboard
   */
  async addColumn(
    dashboardId: string,
    name: string,
    color: string,
  ): Promise<Dashboard> {
    const column = new this.columnModel({
      name: name,
      color: color,
    });
    column.save().then(async (result) => {
      const dashboard = await this.dashboardModel.findById(dashboardId);
      if (!dashboard) {
        throw new NotFoundException('Impossible de trouver ce dashboard');
        column.remove();
      }
      dashboard.columns.push(column._id);
      await dashboard.save();
      return dashboard;
    });
    return null;
  }

  async updateColumn(column: Column) {
    try {
      console.log(column);

      await this.columnModel.findByIdAndUpdate(column._id, column);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Fonction de supression d'une colonne
   * @param id L'objectID de la colonne
   * @param dashboardId L'objectID du dashboard
   */
  async removeColumn(id: string, dashboardId: string) {
    await this.columnModel.findByIdAndRemove(id);
    await this.dashboardModel.findByIdAndUpdate(dashboardId, {
      $pull: { columns: id },
    });
  }
}
