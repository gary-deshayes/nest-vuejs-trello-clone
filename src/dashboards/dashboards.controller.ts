import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DashboardsService } from './dashboards.service';

@Controller('dashboard')
export class DashboardsController {
  constructor(private readonly dashboardService: DashboardsService) {}

  /**
   * Route de récupérations des dashboard
   * @returns Un tableau de dashboard
   */
  @Get()
  getDashboards() {
    const dashboards = this.dashboardService.getDashboards();
    return dashboards;
  }

  /**
   * Route qui permet de récupérer un dashboard via son id
   * @param dashboardId Id Mongodb du dashboard
   * @returns string
   */
  @Get(':id')
  getDashboard(@Param('id') dashboardId: string) {
    const dashboard = this.dashboardService.getSingleDashboard(dashboardId);
    return dashboard;
  }

  /**
   * Route d'ajoute d'un dashboard
   * @param dashboardName Le nom du dashboard
   * @param dashboardDescription La description du dashboard
   * @returns L'id du dashboard crée
   */
  @Post()
  async createDashboard(
    @Body('name') dashboardName: string,
    @Body('description') dashboardDescription: string,
  ): Promise<string> {
    const generateId = await this.dashboardService.createDashboard(
      dashboardName,
      dashboardDescription,
    );
    return generateId;
  }

  /**
   * Route de modification du dashboard
   * @param dashboardId Id Mongodb du dashboard
   * @param dashboardName Nom du dashboard
   * @param dashboardDescription Description du dashboard
   * @returns null
   */
  @Patch()
  async updateDashboard(
    @Body('id') dashboardId: string,
    @Body('name') dashboardName: string,
    @Body('description') dashboardDescription: string,
  ) {
    this.dashboardService.updateDashboard(
      dashboardId,
      dashboardName,
      dashboardDescription,
    );

    return null;
  }

  /**
   * Route qui permet de supprimer un dashboard via son id
   * @param dashboardId Id Mongodb du dashboard
   * @returns string
   */
  @Delete(':id')
  deleteDashboard(@Param('id') dashboardId: string) {
    this.dashboardService.removeDashboard(dashboardId);
    return null;
  }
}
