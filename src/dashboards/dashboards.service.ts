import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dashboard } from './dashboard.model';
import { Model } from 'mongoose';

@Injectable()
export class DashboardsService {
  private dashboards: Dashboard[] = [];

  constructor(
    @InjectModel('Dashboard') private readonly dashboardModel: Model<Dashboard>,
  ) {}

  async getDashboards() {
    const dashboards = await this.dashboardModel.find().exec();
    return dashboards.map((dashboard) => ({
      id: dashboard.id,
      name: dashboard.name,
      description: dashboard.description,
    }));
  }

  getSingleDashboard(dashboardId: string) {
    const dashboard = this.findDashboard(dashboardId);
    return dashboard;
  }

  private async findDashboard(id: string): Promise<Dashboard> {
    const dashboard = await this.dashboardModel.findById(id).populate({
      path: 'columns',
      populate: { path: 'cards' },
    });
    if (!dashboard) {
      throw new NotFoundException('Could not find dashboard');
    }
    return dashboard;
  }

  async createDashboard(name: string, description: string): Promise<string> {
    const dashboard = new this.dashboardModel({
      name: name,
      description: description,
    });
    const result = await dashboard.save();
    this.dashboards.push(dashboard);
    return result.id;
  }

  async updateDashboard(
    id: string,
    name: string,
    description: string,
  ): Promise<Dashboard> {
    const result = await this.dashboardModel
      .findByIdAndUpdate(id, { name, description })
      .exec();
    console.log(result);
    return result;
  }

  async removeDashboard(id: string): Promise<void> {
    await this.dashboardModel.findByIdAndRemove(id);
  }
}
