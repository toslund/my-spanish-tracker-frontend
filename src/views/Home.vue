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
        <h1 class="display-2 mb-3">
          Measure your Spanish vocabulary
        </h1>
        <h1 class="text-h4">
          Track your progress
        </h1>
        <v-container  style="max-width: 700px;">
        <p class="subheading font-weight-regular">
          MySpanishTracker is based on the premise that one aspect of fluency,
          vocabulary, should be measurable and can be used as a long term metric
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
              color="success"
              elevation="2"
              large
              raised
            >Begin</v-btn>
            </v-container>
        </v-row>
      </v-col>

      <!-- <v-col
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
              color="accent"
              elevation="2"
              dark
              large
              raised
            >Flash Cards</v-btn>
            </v-container>
        </v-row>
      </v-col> -->

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
// import Welcome from '../components/Welcome.vue';

export default {
  name: 'Home',
  components: {
  },
};
</script>
