<template>
  <v-dialog
    :value="value" @input="$emit('input', $event)"
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title><span v-if="loaded">{{ deckTitle }}</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div v-if="loaded">
      <progress-chart v-if="loaded" :predictions="deck.predictions" ></progress-chart>
      <v-list
        three-line
        subheader
      >
        <v-subheader>{{ deckUUID }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Content filtering</v-list-item-title>
            <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Password</v-list-item-title>
            <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import ProgressChart from './ProgressChart.vue';

export default {
  name: 'DeckDialog',
  props: { value: { type: Boolean }, deckUUID: { type: String }, givenDeck: { type: Object, optional: true, default: null } },
  components: {
    ProgressChart,
  },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    deleteItemConfirm() {
      console.log('deleteing item');
      console.log(this.deck);
      this.deleteDeck(this.deck.uuid).then((response) => {
        console.log(response);
        this.$emit('delete', response.data.uuid);
        this.dialogDelete = false;
        this.closeDialog();
      });
    },
    async deleteItem(uuid) {
      console.log('requesting to delete deck');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/deck/${uuid}`);
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
    async getItem(uuid) {
      console.log('getting deck');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/decks/${uuid}`);
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
  },
  data: () => ({
    loaded: false,
    dialogDelete: false,
    loading: false,
    apiEndpoint: process.env.VUE_APP_API_URL,
    deck: {
      uuid: null,
      owner: { email: null },
      questions: [],
    },
    deckHeaders: [
      { uuid: 'UUID', value: 'uuid', sortable: false },
    ],
  }),
  computed: {
    deckTitle() {
      return `${this.deck.owner === null ? 'Anonymous' : this.deck.owner.email} - Deck: ${this.deck.uuid !== null ? this.deck.uuid.split('-')[0] : ''}`;
    },
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  mounted() {
    if (!this.givenDeck) {
      this.getItem(this.deckUUID).then((response) => {
        this.deck = response.data;
        this.loaded = true;
      });
    }
  },
};
</script>
