<template>
  <div class="main-container">
    <div v-if="!loaded" class="centered-column">
      <v-progress-circular
        v-if="!loaded"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-if="loaded && !error" class="centered-column is-centered">
      <div class="centered-column">
      <img
          alt="Mail Verified"
          src="@/assets/mail_verified.png"
          width="200"
        />
      </div>
      <div class="centered-column">
        <h1 class="text-h5">
          Thank you!
        </h1>
      </div>
      <div class="centered-column">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="5"
          :value="(timerCount/maxTimerCount)*100"
          color="grey"
        >
          Redirect
        </v-progress-circular>
      </div>
    </div>
     <div v-if="loaded && error" class="centered-column is-centered">
      <div class="centered-column">
        <h1 class="text-h5">
          Token Could not be validated.
        </h1>
      </div>
      <div class="centered-column">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="5"
          :value="(timerCount/maxTimerCount)*100"
          color="grey"
        >
          Redirect
        </v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ConfirmEmail',

  components: {
  },
  data() {
    return {
      loaded: false,
      error: false,
      token: null,
      apiEndpoint: process.env.VUE_APP_API_URL,
      timerCount: 0,
      maxTimerCount: 3,
    };
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0 && this.loaded) {
          setTimeout(() => {
            this.timerCount -= 1;
          }, 1000);
        } else if (value === 0 && this.loaded) {
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  methods: {
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has('token')); // true
    console.log(urlParams.get('token')); // "MyParam"
    const token = urlParams.get('token');
    this.confirmEmail(token).then((response) => {
      console.log('confirmed email');
      console.log(response);
      this.loaded = true;
      this.timerCount = this.maxTimerCount;
    }).catch((error) => {
      console.log(error);
      this.loaded = true;
      this.error = true;
    });
  },
};
</script>
<style>
.main-container {
  display: grid;
  height: 100%;

}

.centered-column {
  justify-self: center;
  align-self: center;
}
.centered-column.is-centered{
  display: grid;
}
</style>
