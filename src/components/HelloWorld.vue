<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome
        </h1>
        <v-container  style="max-width: 700px;">
        <p class="subheading font-weight-regular">
          Measuring fluency or progress while learning a foreign language is difficult.
          MySpanishTracker is founded on the premise that one aspect of language learning,
          vocabulary, should be measurable and should be utilized as a long term metric
          of proficiency and progress.
        </p>
        </v-container>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          How much spanish do I know?
        </h2>

        <v-row justify="center">
            Take our Assesment that will estimate how many of the top 10,000 spanish words you know.
            <v-container>
            <v-btn
              to="/assessment"
              color="primary"
              elevation="2"
              large
              raised
            >Begin</v-btn>
            </v-container>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Help Us Be Better
        </h2>

        <v-row justify="center">
          Review more flash cards. The more data points we have, the
          better we can become at predicting a learners vocabulary.
          <v-container>
            <v-btn
              color="primary"
              elevation="2"
              large
              raised
            >Flash Cards</v-btn>
            </v-container>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Frequency Dictionary
        </h2>

        <v-row justify="center">
          Check out the dictionary under the hood
          <v-container>
            <v-btn to="/frequency-dictionary"
              color="primary"
              elevation="2"
              large
              raised
            >Dictionary</v-btn>
            </v-container>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com/components/api-explorer',
      },
      {
        text: 'Select a layout',
        href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
};
</script>
