<template>
  <v-dialog
    max-width="500"
    :value="value" @input="$emit('input', $event)"
  >
    <v-card elevation="4" light tag="section" v-if="!finished">
        <v-card-title>
          <v-layout align-center justify-space-between>
            <h3 class="headline">
              Sign Up
            </h3>
            <v-flex>
              <v-img alt="Spanish Tracker" class="ml-3" contain height="48px" position="center right" src="@/assets/logo.png"></v-img>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>Sign up with an email and password:</p>
          <v-form
            ref="form"
            v-model="valid"
          >
          <v-text-field
            outline
            label="Email"
            type="text"
            v-model="email"
            :rules="emailRules"
            ></v-text-field>
            <v-text-field
              outline
              hide-details
              label="Password"
              type="password"
              v-model="password"></v-text-field>
          </v-form>
          <v-alert
          v-if="error !== null"
          dense
          outlined
          type="error"
          class="ma-2"
        >
          {{error}}
        </v-alert>
        <p class="privacy-policy">Our <a href="/site-policy/privacy" target="_blank">privacy policy</a> is dead simple. Zero Google.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
          <!-- <v-btn color="info" text>
            Forgot password?
          </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn color="success" :large="$vuetify.breakpoint.smAndUp" @click="submit">
            Sign Up
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="finished === true">
        <v-card-title class="justify-center">
            <h3 class="headline">
              Welcome!
            </h3>
        </v-card-title>
        <v-card-text class="centered-text black--text">
          Please check your email to confirm your account.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="success" to="/assessment" @click="closeDialog" :large="$vuetify.breakpoint.smAndUp">
            Take Assessment
          </v-btn>
          <v-btn @click="closeDialog" :large="$vuetify.breakpoint.smAndUp">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SignUpDialog',
  props: { value: { type: Boolean } },
  watch: {
    // error(newVal) {
    //   if (newVal) {
    //     setTimeout(() => { this.error = null; }, 8000);
    //   }
    // },
  },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    submit() {
      this.emailRules.push((v) => !!v || 'E-mail is required');
      this.emailRules.push((v) => /.+@.+/.test(v) || 'E-mail must be valid');
      if (this.$refs.form.validate()) {
        this.createUser();
      } else {
        console.log('invalid form');
      }
    },
    createUser() {
      this.signUp(this.email, this.password, '')
        .then(() => this.getAuthToken(this.email, this.password))
        .then((response) => {
          console.log(response);
          this.$store.commit('removeSavedDeck');
          this.$store.commit('setAuthToken', response.data);
          this.$emit('success', true);
          this.finished = true;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          this.error = error.response.data.detail;
        });
    },
  },
  data: () => ({
    finished: false,
    submitted: false,
    valid: true,
    error: null,
    email: null,
    emailRules: [],
    password: null,
  }),
};
</script>

<style scoped>
.privacy-policy{
  padding: 1em;
}
</style>
