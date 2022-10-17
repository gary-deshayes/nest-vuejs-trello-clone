<template>
    <div v-if="dashboard" id="dashboard" class="pt-5">
        <router-link :to="`/`" class="button is-link">
            Retour
        </router-link>
        <button @click="deleteDashboard" class="button is-danger ml-3">
            Supprimer le dashboard
        </button>
        <section class="hero is-info mt-5">
            <div class="hero-body">
                <h1 class="title" @click="editingName" v-show="!editing_name">
                    {{ dashboard.name }}
                </h1>
                <input class="input" type="text" id="dashbord_input_name" v-model="dashboard.name" v-show="editing_name" @focusout="updateDashboardName">

                <p class="subtitle" @click="editingDescription" v-show="!editing_description">
                    {{ dashboard.description }}
                </p>
                <textarea class="textarea" v-model="dashboard.description" v-show="editing_description" @focusout="updateDashboardDescription" id="dashbord_input_description" rows="10"></textarea>
            </div>
        </section>
        <div id="dashboard-list" class="is-flex is-justify-content-center is-align-items-baseline is-flex-direction-column">
            <div class="is-align-self-center">
                <h2 class="has-text-weight-bold">Listes</h2>
                <button @click="addColumn" class="button is-primary" id="add_column_dashboard">
                    Ajout d'une colonne
                </button>
            </div>

        </div>
        <section class="box mt-5 columns dashboard-columns">
            <Column v-for="column in dashboard.columns" :key="column.id" :column="column" />
        </section>
    </div>
</template>

<script setup>

import { computed, onMounted, ref, nextTick, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification';
const Column = defineAsyncComponent(() => import('./Column.vue'))
const toast = useToast()
const route = useRoute()
const router = useRouter()
const store = useStore()
const loading_add_column = ref(0)
const dashboard = computed(() => store.state.dashboard)
const editing_name = ref(false)
const editing_description = ref(false)
const previousName = ref('')
const previousDescription = ref('')

onMounted(async () => {
    await store.dispatch('loadDashboard', route.params.id)
})

/**
 * Affiche l'input de modification du nom
 */
const editingName = function () {
    previousName.value = dashboard.value.name
    editing_name.value = true
    let inputEdit = document.getElementById('dashbord_input_name')
    nextTick(() => {
        inputEdit.focus()
    })
}

/**
 * Modifie le nom du tableau
 */
const updateDashboardName = async function(){
    editing_name.value = false
    if (previousName.value != dashboard.value.name) {
        await store.dispatch('updateDashboard', dashboard.value)
        toast.success('Nom modifiée.')
    }
    previousName.value = ''

}

/**
 * Affiche le textarea de la description
 */
const editingDescription = function () {
    editing_description.value = true
    let inputEdit = document.getElementById('dashbord_input_description')
    nextTick(() => {
        inputEdit.focus()
    })
}

/**
 * Modifie la description
 */
const updateDashboardDescription = async function(){
    editing_description.value = false
    if (previousDescription.value != dashboard.value.description) {
        await store.dispatch('updateDashboard', dashboard.value)
        toast.success('Description modifiée.')
    }
    previousDescription.value = ''
}

/**
 * Supprime le dashboard
 */
const deleteDashboard = async function () {
    if (confirm('Êtes vous sur de vouloir supprimer ce dashboard ?')) {
        await store.dispatch('deleteDashboard', dashboard)
        toast.success('Dashboard supprimé.')
        router.push('/')
    }
}

/**
 * Fonction qui ajoute une nouvelle colonne au dashboard
 */
const addColumn = async function () {
    try {
        loading_add_column.value = true
        await store.dispatch('addColumn', { dashboard_id: route.params.id, name: "default name", color: "#FFFFF" })
        loading_add_column.value = false
        toast.success('Colonne ajoutée.')
    } catch (error) {
        console.log(error);
    }
}


</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dashboard-columns {
    overflow: auto;
}

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
