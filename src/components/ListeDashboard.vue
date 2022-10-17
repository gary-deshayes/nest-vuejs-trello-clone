<template>
  <div class="columns is-multiline pt-5">
    <router-link :to="`/dashboard/${dashboard.id}`" v-for="dashboard in dashboards"
                 :key="dashboard.id"
                 class="card column is-3 has-background-white card-dashboard m-5">
      <h2>{{ dashboard.name }}</h2>
      <div class="dashboard-card--createdat">
        {{ dashboard.created_at }}
      </div>
      <div class="dashboard-card--description">
        {{ dashboard.description }}
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
onMounted(async () => {
  await store.dispatch("loadDashboards");
});
const dashboards = computed(() => store.state.dashboards);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.logo {
  height: 64px;
  width: 64px;
}

.card-dashboard {
  border: solid 1px black;
  cursor: pointer;
}

.card-dashboard:hover {
  background-color: hsl(0, 0%, 96%) !important;

  h2 {
    font-weight: bold;
  }
}
</style>
