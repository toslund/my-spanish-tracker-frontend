<template>
  <v-app>
    <sign-up-dialog v-if="signUpDialog" v-model="signUpDialog" @success="showWelcomDialog"></sign-up-dialog>
    <log-in-dialog v-if="logInDialog" v-model="logInDialog"></log-in-dialog>
    <v-app-bar
      app
      color="grey lighten-5"
      class="accent-border"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title @click="$router.push('/')" :style="{ cursor: 'pointer'}">TrackMySpanish</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <div class="nav-buttons-group hidden-sm-and-down">
      <v-btn text to="/">
        Home
      </v-btn>
      <v-btn text to="/about">
        About
      </v-btn>
      <v-btn text to="/assessment">
        Assessment
      </v-btn>
      </div>
      <div class="nav-buttons-group">
      <v-btn v-if="!isLoggedIn" @click="signUpDialog = true">SIGN UP</v-btn>
      <v-btn text small v-if="!isLoggedIn" @click="logInDialog = true" class="hidden-xs-only">Log In</v-btn>
      </div>
      <v-menu v-if="isLoggedIn" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            {{displayName}}
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                text
                @click="logOut"
              >
                <span class="mr-2">{{displayName === 'GUEST' ? 'Forget Me' : 'Log Out'}}</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="drawer = true" class="hidden-md-and-up">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer 
      v-model="drawer"
      absolute
      temporary
      right>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Navigator
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ displayName }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list
        dense
        nav
      >
        <v-list-item v-if="!isLoggedIn" @click="logInDialog = true">
          Log In
        </v-list-item>
        <v-list-item to="/">
          Home
        </v-list-item>
        <v-list-item to="/about">
          About
        </v-list-item>
        <v-list-item to="/assessment">
          Assessment
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
    <v-footer
      :padless="true"
    >
      <v-snackbar
      v-model="contactSnackbar"
      :timeout="3000"
    >
      {{ `${contactEmailLocal}@${contactEmailDomain}`}}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="contactSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
      <v-card
        flat
        tile
        width="100%"
        class="white text-center"
      >
        <v-card-text>
          <v-btn class="mx-4" color="primary" icon @click="contactSnackbar = true">
            <v-icon size="24px">
              mdi-email
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="primary--text">
          {{ new Date().getFullYear() }} — <strong>TrackMySpanish.com</strong> - <a href="/site-policy/privacy">Privacy</a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import LogInDialog from './components/LogInDialog.vue';
import SignUpDialog from './components/SignUpDialog.vue';

export default {
  components: { LogInDialog, SignUpDialog },
  name: 'App',
  data: () => ({
    contactEmailLocal: 'inquiries',
    contactEmailDomain: process.env.VUE_APP_EMAIL_DOMAIN,
    contactSnackbar: false,
    drawer: false,
    welcomeDialog: true,
    signUpDialog: false,
    logInDialog: false,
    apiEndpoint: process.env.VUE_APP_API_URL,
  }),
  methods: {
    showWelcomDialog() {
      this.welcomeDialog = true;
    },
    logOut() {
      this.$store.commit('logOut');
      if (this.$route.name === 'Home') {
        this.$router.go();
      } else { this.$router.push('/'); }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      const headers = this.isLoggedIn ? { Authorization: `Bearer ${this.authToken}` } : null;
      const url = new URL(`${this.apiEndpoint}/users/me`);
      const options = {
        method: 'GET',
        headers,
        url, 
      };
      axios(
        options,
      ).then((response) => {
        console.log('got /me');
        console.log(response.data);
      }).catch((error) => {
        if (!error.status) {
          // network error
          console.log('network error');
          console.log(error);
        } else {
          console.log('error in getting /me');
          console.log(error);
          this.logOut();
        }
      });
    }
  },
  computed: {
    authToken() {
      return this.$store.getters.authToken;
    },
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userEmail() {
      return this.$store.getters.userEmail;
    },
    displayName() {
      if (this.userEmail === null) {
        return '';
      }
      console.log(this.userEmail.split('@')[1]);
      console.log(process.env.VUE_APP_EMAIL_DOMAIN);
      if (!this.isLoggedIn) { return ''; }
      if (this.userEmail.split('@')[1] === process.env.VUE_APP_EMAIL_DOMAIN) {
        return 'GUEST';
      }
      return this.userEmail;
    },
  },
};
</script>
<style>
a {
  text-decoration: none;
}
.v-toolbar__content{
  border-top: 4px solid #AA151B !important;
}

.nav-buttons-group > * {
  margin-right: 1em;
}
</style>
