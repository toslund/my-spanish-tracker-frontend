<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="100"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="text-h4 mb-3">
          Measure your Spanish vocabulary
        </h1>
        <h1 class="text-h4">
          Track your progress
        </h1>
      </v-col>
    </v-row>
    <div class="feature-gallery mt-4">
        <div class="feature">
          <h2 class="headline font-weight-bold mb-3 centered-text">
            Measure your vocabulary
          </h2>
          <p class="centered-text">
              How many of the top 10,000 words do you know?
              <br>100 Questions - 10 minutes.
          </p>
          <div class="centered-text">
              <v-btn
                to="/assessment"
                color="success"
                elevation="2"
                large
                raised
              >Begin</v-btn>
          </div>
        </div>
        <div class="feature">
          <h2 class="headline font-weight-bold mb-3 centered-text">
            Spanish Frequency Dictionary
          </h2>
          <p class="centered-text">
            Browse words, ranked by frequency.
          </p>
          <div class="centered-text">
              <v-btn to="/frequency-dictionary"
                elevation="2"
                large
                raised
              >Dictionary</v-btn>
          </div>
        </div>
      </div>
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
<style scoped>

.feature-gallery {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1em;
  justify-content: center;
}

@media (min-width: 50em) {
  .feature-gallery {
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  }
  .feature {
    padding: 1.5em;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
  }
}

@media (min-width: 75em) {
  .feature {
    padding: 3em;
  }
}

.centered-text {
  text-align: center;
}

/* .feature-tile {

} */

</style>
