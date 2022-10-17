<template>
    <div class="column is-2 box has-border mx-2" @drop="dropCard($event, column)" @dragover.prevent="dragOver($event, column)" @dragenter.prevent="dragEnter($event, column)" @dragleave="dragLeave($event, column)" :data-column="column.id">
        <div class="is-flex mb-3">
            <button @click="deleteColumn" class="delete has-background-danger mr-3"></button>
            <h3 @click="editingColumnName" v-show="!editing" class="has-text-weight-bold">{{ column.name }}</h3>
        </div>
        <input class="w-50" type="text" :id="`inputColumnName-${column.id}`" :ref="`inputColumnName-${column.id}`" v-model="column.name" v-show="editing" @focusout="updateColumnName">
        <div class="list-cards">
            <Card @open-card="afficheModalCard(card)" draggable="true" @dragstart="startDrag($event, card, column)" v-for="card in column.cards" :card="card" :key="card.id" :data-card-id="card.id" />
        </div>
        <div class="modal">
            <div class="modal-background"></div>
            <button @click="closeAllModals" class="modal-close is-large" aria-label="close"></button>
            <div class="modal-card">
                <header class="modal-card-head">
                    <input type="text" v-model="card.title" placeholder="Nom de la carte" required class="input is-normal" />
                </header>
                <section class="modal-card-body">
                    <textarea class="textarea" v-model="card.description" rows="5" placeholder="Description de la carte"></textarea>
                </section>
                <footer class="modal-card-foot is-flex is-justify-content-space-around">
                    <button @click="deleteCard(card)" type="button" class="button is-danger" v-if="card.id">
                        Supprimer la carte
                    </button>
                    <button @click="updateCard" type="button" class="button is-success">
                        Sauvegarder
                    </button>
                </footer>
            </div>

        </div>
        <button @click="afficheModalCard" class="button add_card_column is-primary is-fullwidth">
            +
        </button>
    </div>
</template>

<script setup>
import Card from '../components/Card.vue'
import { toRefs, defineProps, ref, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const store = useStore()
const props = defineProps({
    column: Object
})
let editing = ref(false)
let { column } = toRefs(props)
let previousName = ref('')
const dashboard = computed(() => store.state.dashboard)
const card = computed(() => store.state.selected_card)
const selectedColumn = computed(() => store.state.selected_column)

/**
 * Supprime la colonne
 */
const deleteColumn = async function(){
    if(confirm('Vous êtes sûr de vouloir supprimer : ' + column.value.name)){
        let name = column.value.name
        await store.dispatch('deleteColumn', { column: column.value, dashboard: dashboard.value })
        toast.success(`Colonne '${name}' supprimée avec succès.`)
    }
}

/**
 * Permets d'afficher l'input caché dans le label de la colonne
 * @param {*} evt 
 */
const editingColumnName = function (evt) {
    previousName.value = column.value.name
    editing.value = true
    let inputEdit = document.getElementById(`inputColumnName-${column.value.id}`)
    nextTick(() => {
        inputEdit.focus()
    })
}
/**
 * Modifie le nom de la colonne s'il a changé
 * @param {*} evt 
 */
const updateColumnName = async function (evt) {
    editing.value = false
    if (previousName.value != column.value.name) {
        await store.dispatch('updateColumn', column.value)
    }
    previousName.value = ""
}
/**
 * Affiche la modal de création d'une card
 * @param {*} column 
 */
const afficheModalCard = async function (card) {
    await store.dispatch('selectCard', card)
    await store.dispatch('selectColumn', column.value)
    let modal = document.getElementsByClassName('modal')[0]
    modal.classList.add('is-active')
}

/**
 * Permets de fermer une modal
 * @param {*} $el 
 */
function closeModal($el) {
    $el.classList.remove('is-active');
}

/**
 * Ferme toute les modals
 */
const closeAllModals = function () {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
    });
}

/**
 * Création et mise à jour d'une carte
 */
const updateCard = async function () {
    if (!card.value.id) {
        await store.dispatch('addCard', { card: card.value, column_id: selectedColumn.value._id })
        toast.success('Carte ajoutée.')
    } else {
        await store.dispatch('updateCard', { card: card.value })
        toast.success(`Carte modifiée`)
    }
    closeAllModals()
}

/**
 * Supprime la carte
 */
 const deleteCard = async function(card){
    if(confirm('Vous êtes sûr de vouloir supprimer cette carte ?')){
        let title = card.title
        await store.dispatch('deleteCard', card)
        closeAllModals()
        toast.success(`Carte '${title}' supprimée avec succès.`)
    }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
    scrollbar-width: auto;
    scrollbar-color: #3e8ed0 #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 9px;
}

*::-webkit-scrollbar-track {
    background: #ffffff;
}

*::-webkit-scrollbar-thumb {
    background-color: #3e8ed0;
    border-radius: 10px;
    border: 3px solid #ffffff;
}

.has-border {
    border: solid 1px black;
}

.list-cards {
    overflow: auto;
    height: 300px;
    margin-bottom: 15px;
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
