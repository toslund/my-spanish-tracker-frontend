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
        <span class="text-h5">User</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="user.full_name"
                label="Full Name"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="user.email"
                label="Email"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.uuid"
                label="UUID"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            hide-default-header
            hide-default-footer
            :headers="deckHeaders"
            :items="user.decks"
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
  name: 'UserDialog',
  props: { value: { type: Boolean }, userUUID: { type: String }, givenUser: { type: Object, optional: true, default: null } },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    deleteItemConfirm() {
      console.log('deleteing item');
      console.log(this.user);
      this.deleteUser(this.user.uuid).then((response) => {
        console.log(response);
        this.$emit('delete', response.data.uuid);
        this.dialogDelete = false;
        this.closeDialog();
      });
    },
    async deleteUser(uuid) {
      console.log('requesting to delete user');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/users/${uuid}`);
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
    async getUser(uuid) {
      console.log('getting user');
      this.loading = true;
      const url = new URL(`${this.apiEndpoint}/users/${uuid}`);
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
    dialogDelete: false,
    loading: false,
    apiEndpoint: process.env.VUE_APP_API_URL,
    user: {
      full_name: null,
      email: null,
      uuid: null,
      decks: [],
    },
    deckHeaders: [
      { uuid: 'UUID', value: 'uuid', sortable: false },
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
    if (!this.givenUser) {
      this.getUser(this.userUUID).then((response) => {
        this.user = response.data;
      });
    }
  },
};
</script>
