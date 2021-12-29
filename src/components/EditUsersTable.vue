<template>
  <v-container v-if="isSuperUser">
    <user-dialog v-if="dialogUser" v-model="dialogUser" :userUUID="editUserUUID" @delete="handleDelete($event)"/>
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :headers="headers"
          :items="users"
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
            @click="editUser(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import UserDialog from './UserDialog.vue';

export default {
  name: 'EditUsersTable',
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  components: {
    UserDialog,
  },
  methods: {
    handleDelete(uuid) {
      console.log('handle delete in parent');
      console.log(uuid);
      let deleteIndex = null;
      for (let i = 0; i < this.users.length; i += 1) {
        if (this.users[i].uuid === uuid) {
          console.log('uuid found');
          console.log(i);
          deleteIndex = i;
          break;
        }
      }
      if (deleteIndex !== null) {
        this.users.splice(deleteIndex, 1);
      }
    },
    editUser(item) {
      this.editUserUUID = item.uuid;
      // this.editingUser = user;
      this.dialogUser = true;
    },
    deleteUser(item) {
      console.log(item);
    },
    async getUsers() {
      console.log('requesting users');
      this.loading = true;
      const url = new URL(`${this.userEndpoint}/`);
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
      dialogUser: false,
      userEndpoint: `${process.env.VUE_APP_API_URL}/users`,
      users: [],
      editingUser: null,
      loading: false,
      pageCount: null,
      headers: [
        { text: 'Full Name', value: 'full_name', align: 'center' },
        { text: 'Email', value: 'email', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.getUsers().then((response) => {
      console.log('got users');
      this.users = response.data;
      this.users.forEach((user) => {
        console.log(user);
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
