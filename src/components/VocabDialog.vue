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
        <span class="text-h5">Vocab</span>
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
                v-model="editedVocab.word"
                label="Word"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="editedVocab.pos"
                label="Part of Speech"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            hide-default-footer
            :headers="definitionHeaders"
            :items="definitions"
            @click:row="handleRowClick"
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
          @click.native="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="fooMethod"
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
  props: { value: { type: Boolean }, vocab: { type: Object, optional: true }, definitions: { type: Array, optional: true } },
  mounted() {
    this.editedVocab = { ...this.vocab };
  },
  methods: {
    closeDialog() {
      this.$emit('delete', this.editedVocab.uuid);
      this.$emit('input', false);
    },
    deleteItemConfirm() {
      console.log('deleteing item');
      console.log(this.editedVocab);
      this.delete(this.editedVocab.uuid).then((response) => {
        console.log(response);
        this.dialogDelete = false;
        this.closeDialog();
      });
    },
    async deleteVocab(uuid) {
      console.log('requesting vocabs');
      this.loading = true;
      const url = new URL(`${this.vocabEndpoint}/${uuid}`);
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
    handleRowClick(event) {
      console.log(event);
      this.$emit('editDefinition', event);
    },
    fooMethod() {
      console.log('foo method');
    },
  },
  data: () => ({
    dialogDelete: false,
    vocabEndpoint: `${process.env.VUE_APP_API_URL}/vocabs`,
    editedVocab: {
      word: null,
      pos: null,
      definitions: [],
    },
    definitionHeaders: [
      {
        text: 'Rank',
        align: 'start',
        value: 'rank',
        sortable: false,
      },
      { text: 'Definition', value: 'content', sortable: false },
    ],
  }),
  computed: {
    authToken() {
      return this.$store.getters.authToken;
    },
  },
};
</script>
