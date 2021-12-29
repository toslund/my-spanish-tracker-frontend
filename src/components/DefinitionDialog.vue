<template>
  <v-dialog
    :value="value" @input="$emit('input', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Definition</span>
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
                v-model="definition.rank"
                label="Definition Rank"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <v-text-field
                v-model="definition.content"
                label="Definition"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <v-text-field
                v-model="definition.note"
                label="Note"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="definition.region"
                label="Region"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="definition.pos"
                label="Part of Speech"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
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
  name: 'DefinitionDialog.',
  props: { value: { type: Boolean }, definitionUUID: { type: String, optional: true }, givenDefinition: { type: Object, optional: true, default: null } },
  methods: {
    fooMethod() {
      console.log('foo method');
    },
    async getDefinition(uuid) {
      console.log('getting definition');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/definitions/${uuid}`);
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
    loading: false,
    apiEndpoint: process.env.VUE_APP_API_URL,
    definition: {
      rank: null,
      content: null,
      region: null,
      notes: null,
    },
  }),
  mounted() {
    if (!this.givenDefinition) {
      this.getDefinition(this.definitionUUID).then((response) => {
        this.definition = response.data;
      });
    } else {
      this.definition = { ...this.givenDefinition };
    }
  },
};
</script>
