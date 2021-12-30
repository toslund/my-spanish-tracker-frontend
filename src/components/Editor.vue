<template>
  <v-container v-if="isSuperUser">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab"
      >
        {{tab}}
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item key="lemmas">
        <edit-lemmas-table></edit-lemmas-table>
      </v-tab-item>
      <v-tab-item key="vocab">
        <vocab-dialog v-if="dialogVocab" v-model="dialogVocab" :vocab="editingVocab" :definitions="definitions[editingVocab.uuid].definitions" @delete="handleDeleteVocab($event)" @editDefinition="editDefinition($event)"/>
        <definition-dialog v-if="dialogDefinition" v-model="dialogDefinition" :givenDefinition="editingDefinition"/>
        <lemma-dialog v-if="dialogLemma" v-model="dialogLemma" :lemmaUUID="editLemmaUUID"/>
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :headers="headers"
          :items="vocabs"
          :items-per-page="100"
          :search="search"
          :options.sync="options"
          @current-items="fillDefinitions"
          class="elevation-1"
          :custom-filter="exactSearch ? filterLiterally : filterBeginsWith"
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
        <template v-slot:item.definitions="{ item }">
          <v-progress-circular
            v-if="definitions[item.uuid].loaded === false"
            :width="3"
            color="blue"
            indeterminate
          ></v-progress-circular>
          <span
            v-else>
            {{definitions[item.uuid].definitions[0].content}}
          </span>
        </template>
        <template v-slot:item.lemma="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editLemma(item)"
          >
            mdi-alpha-l-circle
          </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editVocab(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item key="users">
        <edit-users-table></edit-users-table>
      </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import axios from 'axios';
import VocabDialog from './VocabDialog.vue';
import LemmaDialog from './LemmaDialog.vue';
import DefinitionDialog from './DefinitionDialog.vue';
import EditUsersTable from './EditUsersTable.vue';
import EditLemmasTable from './EditLemmasTable.vue';

export default {
  name: 'Editor',
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
  },
  components: {
    VocabDialog,
    LemmaDialog,
    DefinitionDialog,
    EditUsersTable,
    EditLemmasTable,
  },
  methods: {
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
    editVocab(item) {
      this.editingVocab = item;
      this.dialogVocab = true;
    },
    editLemma(item) {
      this.editLemmaUUID = item.lemma_uuid;
      this.dialogLemma = true;
    },
    handleDeleteVocab(vocabUUID) {
      console.log('delete vocab in parent');
      console.log(vocabUUID);
    },
    editDefinition(item) {
      console.log('edit def in parent');
      console.log(item);
      this.editingDefinition = item;
      this.dialogDefinition = true;
    },
    async getVocabs() {
      console.log('requesting vocabs');
      this.loading = true;
      const url = new URL(`${this.vocabEndpoint}/all`);
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
    async getVocabDefinitions(vocabUUID) {
      console.log('requesting definitions');
      console.log(vocabUUID);
      const url = new URL(`${this.vocabEndpoint}/${vocabUUID}/definitions`);
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
    fillDefinitions(vocabs) {
      vocabs.forEach((vocab) => {
        if (this.definitions[vocab.uuid].loaded === true) {
          return true;
        }
        this.getVocabDefinitions(vocab.uuid).then((response) => {
          this.definitions[vocab.uuid].definitions = response.data;
          this.definitions[vocab.uuid].loaded = true;
        });
        return true;
      });
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
      tab: 'vocab',
      tabs: ['lemmas', 'vocab', 'users'],
      search: '',
      exactSearch: false,
      options: { itemsPerPage: 0, page: 1 },
      dialogVocab: false,
      dialogLemma: false,
      dialogDefinition: false,
      vocabEndpoint: `${process.env.VUE_APP_API_URL}/vocabs`,
      vocabs: [],
      definitions: { example: { definitions: [], loaded: false } },
      editingVocab: null,
      loading: false,
      pageCount: null,
      headers: [
        { 
          text: 'Word', value: 'word', align: 'center',
        },
        { 
          text: 'POS', value: 'pos', align: 'center', filterable: false,
        },
        {
          text: 'Definitions', value: 'definitions', align: 'center', sortable: false, filterable: false,
        },
        { text: 'Lemma', value: 'lemma', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.getVocabs().then((response) => {
      console.log('got vocabs');
      this.vocabs = response.data;
      this.vocabs.forEach((vocab) => {
        this.$set(this.definitions, vocab.uuid, { definitions: [], loaded: false });
        // this.definitions[vocab.uuid] = { definitions: [], loaded: false };
      });
      this.options.itemsPerPage = 100;
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
