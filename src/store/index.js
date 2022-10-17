//import the createStore object from Vuex
import {
  createStore
} from 'vuex'
// Import axios to make HTTP requests
import axios from "axios"
axios.defaults.baseURL = 'http://127.0.0.1:3000/'
export default createStore({
  state: {
    dashboards: [],
    dashboard: {},
    selected_card: {},
    selected_column: {},
  },
  getters: {
    listeDashboards: state => {
      return state.dashboards
    },
    dashboard: state => {
      return state.dashboard
    },
    selectedCard: state => {
      if (!state.selected_card.id) {
        state.selected_card = {
          id: null,
          title: "",
          description: ""
        }
      }
      return state.selected_card
    },
    selectedColumn: state => {
      return state.selected_column
    }
  },
  actions: {
    selectCard({
      commit
    }, card) {
      commit('set_selected_card', card)
    },
    selectColumn({
      commit
    }, column) {
      commit('set_selected_column', column)
    },
    async loadDashboards({
      commit
    }) {
      try {
        let response = await axios.get('dashboard')
        commit('set_dashboards', response.data)
      } catch (error) {
        console.log(error);
      }
    },
    async loadDashboard({
      commit
    }, id) {
      try {
        let response = await axios.get(`dashboard/${id}`)
        commit('set_dashboard', response.data)
      } catch (error) {
        console.log(error);
      }
    },
    async updateDashboard({
      commit
    }, dashboard) {
      try {
        let obj = {
          dashboard: {
            id: dashboard.id,
            name: dashboard.name,
            description: dashboard.description
          }
        }
        await axios.put(`dashboard`, obj)
      } catch (error) {
        console.log(error);
      }
    },
    async deleteDashboard({
      commit
    }, dashboard) {
      try {
        await axios.delete(`dashboard`, {
          data: {
            dashboard: dashboard.value.id
          }
        })
      } catch (error) {
        console.log(error);
      }
    },
    async updateColumn({
      commit
    }, column) {
      try {
        await axios.put(`dashboard/column`, {
          column
        })
      } catch (error) {
        console.log(error);
      }
    },
    async addColumn({
      commit
    }, column) {
      try {
        let response = await axios.post(`dashboard/column`, column)
        response.data.cards = []
        this.state.dashboard.columns.push(response.data[0])
      } catch (error) {
        console.log(error);
      }
    },
    async deleteColumn({
      commit
    }, data) {
      try {
        console.log(data);
        await axios.delete(`dashboard/column/${data.column._id}`, {
          data: {
            dashboard_id: data.dashboard._id
          }
        })
        this.state.dashboard.columns = this.state.dashboard.columns.filter(o => o.id != data.column
          ._id)
      } catch (error) {
        console.log(error);
      }
    },
    async addCard({
      commit
    }, card) {
      try {
        let response = await axios.post(`dashboard/card`, card)
        response.data
        this.state.dashboard.columns.find(o => o.id == card.column_id).cards.push(response
          .data[0])
      } catch (error) {
        console.log(error);
      }
    },
    async updateCard({
      commit
    }, card) {
      try {
        await axios.put(`dashboard/card`, card)
        let column = this.state.dashboard.columns.find(
          (c) => c.id == result.data[0].column_id,
        )
        let index = column.cards.findIndex((c) => c.id == result.data[0].id)
        column.cards[index] = result.data[0]
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCard({
      commit
    }, card) {
      try {
        await axios.delete(`dashboard/card`, {
          data: {
            card: card.id
          }
        })
        this.state.dashboard.columns.find(o => o.id == card.column_id).cards = this.state
          .dashboard.columns.find(o => o.id == card.column_id).cards.filter(d => d.id != card
            .id)
      } catch (error) {
        console.log(error);
      }
    },
  },
  mutations: {
    set_dashboards: (state, dashboards) => {
      state.dashboards = dashboards
    },
    set_dashboard: (state, dashboard) => {
      state.dashboard = dashboard
    },
    set_selected_card: (state, card) => {
      state.selected_card = card
    },
    set_selected_column: (state, column) => {
      state.selected_column = column
    }
  }
})
/** we have just created a boiler plate for our vuex store module**/
