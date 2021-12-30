<template>
  <v-app>
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
        <v-toolbar-title @click="$router.push('/')" >My Spanish Tracker</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="isSuperUser" to="/crud">DATA</v-btn>
      <log-in-dialog v-if="!isLoggedIn"></log-in-dialog>

      <v-menu v-if="isLoggedIn" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            {{userEmail}}
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
                <span class="mr-2">Log Out</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import LogInDialog from './components/LogInDialog.vue';

export default {
  components: { LogInDialog },
  name: 'App',
  data: () => ({
    //
  }),
  methods: {
    logOut() {
      this.$store.commit('logOut');
      this.$store.commit('removeSavedDeck');
    },
  },
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userEmail() {
      return this.$store.getters.userEmail;
    },
  },
};
</script>
<style>
.v-toolbar__content{
  border-top: 4px solid #AA151B !important;
}
</style>
