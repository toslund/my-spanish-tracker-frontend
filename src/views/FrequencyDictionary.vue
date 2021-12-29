<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="vocabs"
      :options.sync="options"
      :item-class="itemRowBackground"
      :server-items-length="totalVocabs"
      class="elevation-1"
    >
    <template v-slot:item.pos="{ item }">
      <v-chip>
        {{item.pos}}
      </v-chip>
    </template>
    </v-data-table>
  </v-container>
</template>

<script>
// import HelloWorld from '../components/HelloWorld.vue';
import axios from 'axios';

export default {
  name: 'FrequencyDictionary',

  components: {
  },
  methods: {
    getVocabs() {
      console.log('requesting verbs');
      const url = new URL(this.vocabEndpoint);
      url.searchParams.set('skip', this.options.itemsPerPage * (this.options.page - 1));
      url.searchParams.set('limit', this.options.itemsPerPage);
      axios
        .get(url)
        .then((response) => {
          this.vocabs = response.data.vocabs;
          // this.vocabs.push(...response.data.vocabs);
          this.totalVocabs = response.data.total_count;
        });
    },
    itemRowBackground(item) {
      return item.rank % 2 ? 'cell-odd' : 'cell-even';
    },
    parseVocabs() {
    },
  },
  watch: {
    options: {
      handler() {
        this.getVocabs();
      },
      deep: true,
    },
  },
  data() {
    return {
      totalVocabs: 0,
      options: {},
      vocabEndpoint: `${process.env.VUE_APP_API_URL}/vocabs/`,
      vocabs: [],
      pageCount: null,
      headers: [
        {
          text: 'Rank',
          align: 'start',
          sortable: false,
          value: 'rank',
        },
        { text: 'Word', value: 'word', align: 'center' },
        { text: 'Definition', value: 'definitions[0].content', align: 'center' },
        { text: 'POS', value: 'pos', align: 'center' },
      ],
      posLookup: {
        l: 'article',
        e: 'preposition',
        c: 'conjunctions',
        v: 'verb',
        d: 'pronoun',
        n: 'noun',
        m: 'card/ord number',
        j: 'adjective',
        p: 'pronoun',
        r: 'adverb',
      },
    };
  },
  mounted() {
    // this.getVocabs();
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
