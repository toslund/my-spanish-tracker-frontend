<template>
  <v-dialog
    :value="value" @input="$emit('input', $event)"
    max-width="500"
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
      <v-card-title>
        <span class="text-h5">Lemma</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="lemma.rank"
                label="Word"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="lemma.word"
                label="Word"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="lemma.pos"
                label="Part of Speech"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="lemma.note"
                label="Note"
              ></v-text-field>
              <v-text-field
                v-model="lemma.note_grammar"
                label="Grammar Note"
              ></v-text-field>
              <v-text-field
                v-model="lemma.uuid"
                label="UUID"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            hide-default-header
            hide-default-footer
            :headers="vocabHeaders"
            :items="lemma.vocabs"
            class="elevation-1"
          ></v-data-table>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="dialogDelete=true"
        >
          Delete
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click.native="$emit('input', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          disabled
          @click="true"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VocabDialog',
  props: { value: { type: Boolean }, lemmaUUID: { type: String }, givenLemma: { type: Object, optional: true, default: null } },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    deleteItemConfirm() {
      console.log('deleteing item');
      console.log(this.lemma);
      this.deleteLemma(this.lemma.uuid).then((response) => {
        console.log(response);
        this.$emit('delete', response.data.uuid);
        this.dialogDelete = false;
        this.closeDialog();
      });
    },
    async deleteLemma(uuid) {
      console.log('requesting to delete lemma');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/lemmas/${uuid}`);
      // url.searchParams.set('all', true);
      // url.searchParams.set('limit', 100);
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
    async getLemma(uuid) {
      console.log('getting lemma');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/lemmas/${uuid}`);
      // url.searchParams.set('all', true);
      // url.searchParams.set('limit', 100);
      const options = {
        method: 'GET',
        // headers: { Authorization: `Bearer ${this.authToken}` },
        url,
      };
      const response = await axios(
        options,
      );
      return response;
    },
  },
  data: () => ({
    dialogDelete: false,
    loading: false,
    apiEndpoint: process.env.VUE_APP_API_URL,
    lemma: {
      rank: null,
      word: null,
      pos: null,
      vocabs: [],
    },
    vocabHeaders: [
      { text: 'Vocab', value: 'word', sortable: false },
    ],
  }),
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  mounted() {
    if (!this.givenLemma) {
      this.getLemma(this.lemmaUUID).then((response) => {
        this.lemma = response.data;
      });
    }
  },
};
</script>
