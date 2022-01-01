<template>
  <v-dialog
    :value="value" @input="$emit('input', $event)"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-dialog v-if="isSuperUser" v-model="dialogDelete" max-width="500px">
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
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title><span v-if="loaded">{{ deckTitle }}</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="isSuperUser">
          <v-btn
            dark
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div v-if="!loaded" style="height: 100vh;">
        <v-container fill-height >
          <v-row justify="center" align="center">
            <v-progress-circular
            indeterminate
            color="red"
          ></v-progress-circular>
          </v-row>
        </v-container>
      </div>
      <div v-if="loaded">
      <v-card-title v-if="!isSuperUser" class='justify-center text-h6'>
        Thank you for your time!
      </v-card-title>
      <v-card-title v-else class='justify-center text-h6'>
        Results:
      </v-card-title> 
      <v-card-title class='justify-center text-h6'>
        <span>{{isSuperUser ? 'Estimated vocabulary' : 'You have an estimated vocabulary of'}}:<span class="font-weight-bold"> {{predictedCorrect}} words</span></span>
      </v-card-title> 
      <v-container>
        <v-row justify="center">
        <v-simple-table >
          <template v-slot:default>
            <!-- <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Calories
                </th>
              </tr>
            </thead> -->
            <tbody>
              <tr>
                <td>Predicted Vocabulary of first 10,000 Words</td>
                <td>{{predictedCorrect}}</td>
              </tr>
              <tr
              >
                <td>Total Questions Asked</td>
                <td>{{questionsTotal}}</td>
              </tr>
              <tr>
                <td>Total Questions Known</td>
                <td>{{questionsCorrect}}</td>
              </tr>
              <tr>
                <td>Predicted Vocabulary (naive)</td>
                <td>{{predictedCorrectNaive}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </v-row>
      </v-container>
      <progress-chart v-if="loaded" :predictions="deck.predictions" ></progress-chart>
      <v-divider></v-divider>
      <v-container>
        <v-row justify="center">
          <v-col justify="center" class="flex-grow-0">
          <h1 class="text-h5">Vocabulary</h1>
          <v-simple-table height="300px" dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Word
                  </th>
                  <th class="text-left">
                    Correct
                  </th>
                  <th class="text-left">
                    Familiarity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="question in deck.questions"
                  :key="question.uuid"
                >
                  <td>{{ question.vocab.word }}</td>
                  <td>
                    <v-icon v-if="question.correct">mdi-check</v-icon>
                    <v-icon v-if="!question.correct">mdi-close</v-icon>
                    </td>
                    <td>{{ question.familiarity }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
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
      questions: [{
        correct: false,
        correctness: null,
        familiarity: 0,
        recognize: false,
        uuid: '',
        vocab: {
          note: '',
          pos: '',
          uuid: '',
          word: '',
        },
      }],
      predictions: [
        {
          total_questioned: 89,
          total_correct: 48,
          total_predicted_correct: 4878,
          total_predicted_correct_naive: 5426,
          data_length: 10061,
        },
      ],
    },
    deckHeaders: [
      { uuid: 'UUID', value: 'uuid', sortable: false },
    ],
  }),
  computed: {
    lastPredictionIdx() {
      return this.deck.predictions.length - 1;
    },
    questionsTotal() {
      if (this.lastPredictionIdx !== -1) {
        console.log(this.deck.predictions);
        console.log('this.lastPredictionIdx');
        console.log(this.lastPredictionIdx);
        return this.deck.predictions[this.lastPredictionIdx].total_questioned;
      }
      return 0;
    },
    questionsCorrect() {
      if (this.lastPredictionIdx !== -1) {
        return this.deck.predictions[this.lastPredictionIdx].total_correct;
      }
      return 0;
    },
    predictedCorrect() {
      if (this.lastPredictionIdx !== -1) {
        return this.deck.predictions[this.lastPredictionIdx].total_predicted_correct;
      }
      return 0;
    },
    predictedCorrectNaive() {
      if (this.lastPredictionIdx !== -1) {
        return this.deck.predictions[this.lastPredictionIdx].total_predicted_correct_naive;
      }
      return 0;
    },
    datasetLength() {
      if (this.lastPredictionIdx !== -1) {
        return this.deck.predictions[this.lastPredictionIdx].data_length;
      }
      return 0;
    },
    // datasets() {
    //   const posLookup = {}
    //   const posData = {}
    //   for (let i = 0; i < deck.questions.length; i += 1) {
    //     if ()
    //   }
    //   if (this.lastPredictionIdx !== -1) {
    //     return this.deck.predictions[this.lastPredictionIdx].data_length;
    //   }
    //   return 0;
    // },
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
