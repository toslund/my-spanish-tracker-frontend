<template>
  <v-container v-if="isSuperUser">
        <lemma-dialog v-if="dialogLemma" v-model="dialogLemma" :lemmaUUID="editLemmaUUID" @delete="handleDelete($event)"/>
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :headers="headers"
          :items="lemmas"
          :search="search"
          :custom-filter="exactSearch ? filterLiterally : filterBeginsWith"
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
            @click="editLemma(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
// import VocabDialog from './VocabDialog.vue';
import LemmaDialog from './LemmaDialog.vue';

export default {
  name: 'EditLemmassTable',
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  components: {
    LemmaDialog,
  },
  methods: {
    handleDelete(uuid) {
      console.log('handle delete in parent');
      console.log(uuid);
      let deleteIndex = null;
      for (let i = 0; i < this.lemmas.length; i += 1) {
        if (this.lemmas[i].uuid === uuid) {
          console.log('uuid found');
          console.log(i);
          deleteIndex = i;
          break;
        }
      }
      if (deleteIndex !== null) {
        this.lemmas.splice(deleteIndex, 1);
      }
    },
    editLemma(item) {
      this.editLemmaUUID = item.uuid;
      this.dialogLemma = true;
    },
    filterBeginsWith(value, search) {
      return value != null
        && search != null
        && typeof value === 'string'
        && value.toString().startsWith(search);
    },
    filterLiterally(value, search) {
      return value != null
        && search != null
        && typeof value === 'string'
        && value === search;
    },
    async getLemmas() {
      console.log('requesting vocabs');
      this.loading = true;
      const url = new URL(`${this.lemmasEndpoint}/all`);
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
      lemmasEndpoint: `${process.env.VUE_APP_API_URL}/lemmas`,
      lemmas: [],
      dialogLemma: false,
      editLemmaUUID: null,
      loading: false,
      pageCount: null,
      headers: [
        { text: 'Rank', value: 'rank', align: 'center' },
        { text: 'Lemma', value: 'word', align: 'center' },
        { text: 'POS', value: 'pos', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.getLemmas().then((response) => {
      console.log('got lemmas');
      this.lemmas = response.data;
      // this.lemmas.forEach((lemma) => {
      //   this.$set(this.definitions, vocab.uuid, { definitions: [], loaded: false });
      //   this.definitions[vocab.uuid] = { definitions: [], loaded: false };
      // });
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
