import { Controller, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { Column } from './column.model';
import { ColumnsService } from './columns.service';

@Controller('dashboard/column')
export class ColumnsController {
  constructor(private readonly columnService: ColumnsService) {}

  /**
   * Route d'ajout d'une colonne
   * @param dashboardId L'objectID du dashboard
   * @param name Le nom de la colonne
   * @param color La couleur
   * @returns Le dashboard
   */
  @Post()
  async addColumn(
    @Body('dashboard_id') dashboardId: string,
    @Body('name') name: string,
    @Body('color') color: string,
  ) {
    const dashboard = await this.columnService.addColumn(
      dashboardId,
      name,
      color,
    );
    return dashboard;
  }

  /**
   * Route de modification d'une colonne
   * @param column L'object colonne
   * @returns null
   */
  @Put()
  async updateColumn(@Body('column') column: Column) {
    await this.columnService.updateColumn(column);
    return null;
  }

  /**
   * Route de supression d'une colonne
   * @param id L'objectID de la colonne
   * @param dashboardId L'objectID du dashboard
   */
  @Delete(':id')
  async deleteColumn(
    @Param('id') columnId: string,
    @Body('dashboard_id') dashboardId: string,
  ) {
    await this.columnService.removeColumn(columnId, dashboardId);
  }
}
