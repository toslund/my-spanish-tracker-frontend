<template>
  <v-dialog
    max-width="500"
    :value="value" @input="$emit('input', $event)"
  >
    <v-card elevation="4" light tag="section">
        <v-card-title>
          <v-layout align-center justify-space-between>
            <h3 class="headline">
              Log In
            </h3>
            <v-flex>
              <v-img alt="Spanish Tracker" class="ml-3" contain height="48px" position="center right" src="@/assets/logo.png"></v-img>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>Sign in with your email and password:</p>
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
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
          <!-- <v-btn color="info" text>
            Forgot password?
          </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn color="success" :large="$vuetify.breakpoint.smAndUp" @click="submit">
            <v-icon>mdi-lock</v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LogInDialog',
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
        this.login();
      } else {
        console.log('invalid form');
      }
    },
    login() {
      this.getAuthToken(this.email, this.password)
        .then((response) => {
          console.log(response);
          this.$store.commit('removeSavedDeck');
          this.$store.commit('setAuthToken', response.data);
          this.closeDialog();
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          this.error = this.formatError(error.response.data);
        });
    },
  },
  data: () => ({
    submitted: false,
    valid: true,
    error: null,
    email: null,
    emailRules: [],
    password: null,
  }),
};
</script>
