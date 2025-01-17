<template>
  <v-container v-if="isSuperUser">
    <deck-dialog v-if="dialogDeck" v-model="dialogDeck" :uuiddeck="editDeckUUID" @delete="handleDelete($event)"/>
      <v-dialog v-if="isSuperUser" v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm()">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :headers="headers"
          :items="decks"
          :search="search"
          class="elevation-1"
        >
        <template v-slot:top>
          <v-switch
            v-model="exactSearch"
            label="Exact Search"
            class="pa-3"
          ></v-switch>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editDeck(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="editDeckUUID=item.uuid; dialogDelete = true;"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.uuid="{ item }">
          <span>{{ item.uuid ? `${item.uuid.split('-')[0]}...` : null }}</span>
        </template>
         <template v-slot:item.questions="{ item }">
          <span>{{ resultFromQuestions(item.questions) }}</span>
        </template>
        <template v-slot:item.date_added="{ item }">
          <span>{{ new Date(item.date_added).toLocaleString() }}</span>
        </template>
        </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import DeckDialog from './DeckDialog.vue';

export default {
  name: 'EditDecksTable',
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  components: {
    DeckDialog,
  },
  methods: {
    resultFromQuestions(questions) {
      let total = 0;
      let correct = 0;
      for (let i = 0; i < questions.length; i += 1) {
        total += 1;
        if (questions[i].correct) {
          correct += 1;
        }
      }
      return `${correct}/${total}`;
    },
    editDeck(item) {
      this.editDeckUUID = item.uuid;
      // this.editingDeck = deck;
      this.dialogDeck = true;
    },
    deleteItemConfirm() {
      console.log('deleting item');
      console.log(this.editDeckUUID);
      this.loading = true;
      this.deleteDeck(this.editDeckUUID).then((response) => {
        console.log(response);
        this.loading = false;
        this.handleDelete(response.data.uuid);
        this.dialogDelete = false;
      });
    },
    async deleteDeck(uuid) {
      console.log('requesting to delete Deck');
      // url.searchParams.set('all', true);
      // url.searchParams.set('limit', 100);
      const url = new URL(`${this.apiEndpoint}/decks/${uuid}`);
      const options = {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.authToken}` },
        url,
      };
      const response = await axios(
        options,
      );
      return response;
    },
    handleDelete(uuid) {
      console.log('handle delete in parent');
      console.log(uuid);
      let deleteIndex = null;
      for (let i = 0; i < this.decks.length; i += 1) {
        if (this.decks[i].uuid === uuid) {
          console.log('uuid found');
          console.log(i);
          deleteIndex = i;
          break;
        }
      }
      if (deleteIndex !== null) {
        this.decks.splice(deleteIndex, 1);
      }
    },
    async getDecks() {
      console.log('requesting decks');
      this.loading = true;
      const url = new URL(`${this.deckEndpoint}/`);
      // url.searchParams.set('all', true);
      // url.searchParams.set('limit', 100);
      const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.authToken}` },
        url,
      };
      const response = await axios(
        options,
      );
      return response;
    },
    // fillDefinitions(page, itemsPerPage) {
    //   for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage; i += 1) {
    //     const vocabUUID = this.vocabs[i].uuid;
    //     this.getVocabDefinitions(vocabUUID).then((response) => {
    //       this.definitions[vocabUUID].definitions = response.data;
    //       this.definitions[vocabUUID].loaded = true;
    //     });
    //   }
    // },
  },
  watch: {
  },
  data() {
    return {
      exactSearch: false,
      search: '',
      dialogDeck: false,
      deckEndpoint: `${process.env.VUE_APP_API_URL}/decks`,
      apiEndpoint: process.env.VUE_APP_API_URL,
      dialogDelete: null,
      editDeckUUID: null,
      decks: [
        {
          uuid: null,
          date_added: null,
          user: { email: null },
          questions: [{ vocab: { correct: null } }],
        },
      ],
      editingDeck: null,
      loading: false,
      pageCount: null,
      headers: [
        { text: 'UUID', value: 'uuid', align: 'center' },
        { text: 'User', value: 'owner.email', align: 'center' },
        { text: 'Created', value: 'date_added', align: 'center' },
        { text: 'Questions', value: 'questions', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.getDecks().then((response) => {
      console.log('got decks');
      this.decks = response.data;
      this.decks.forEach((deck) => {
        console.log(deck);
        // this.$set(this.definitions, vocab.uuid, { definitions: [], loaded: false });
        // this.definitions[vocab.uuid] = { definitions: [], loaded: false };
      });
      // this.options.itemsPerPage = 100;
      this.loading = false;
    });
  },
};
</script>
<style>
.cell-even {
  background-color: #f2f1eb
}
.cell-odd {
  background-color: #faf9f5
}
</style>
