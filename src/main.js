import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import '@/plugins/helpers';
// import mixin from './plugins/helpers';

Vue.use(Vuex);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    count: 0,
    authPayload: JSON.parse(window.localStorage.getItem('authPayload')) || { access_token: null, token_type: null },
    deckToken: window.localStorage.getItem('deckToken'),
  },
  mutations: {
    increment(state) {
      state.count += 1;
    },
    setDeck(state, deckToken) {
      console.log('setting deck token');
      console.log(deckToken);
      window.localStorage.setItem('deckToken', deckToken);
      state.deckToken = deckToken;
      // state.authToken = tokenPayload;
    },
    setAuthToken(state, authPayload) {
      console.log('setting auth payload');
      window.localStorage.setItem('authPayload', JSON.stringify(authPayload));
      state.authPayload = authPayload;
    },
    removeSavedDeck(state) {
      console.log('will remove saved deck token');
      window.localStorage.removeItem('deckToken');
      state.deckToken = null;
    },
    logOut(state) {
      // TODO user logs out but deck stays - better solution
      window.localStorage.removeItem('authPayload');
      state.authPayload = null;
    },
  },
  getters: {
    getDeckToken: (state) => state.deckToken,
    getDeckUUID: (state) => {
      if (state.deckToken === null) { return null; }
      const decodedToken = Buffer.from(state.deckToken.split('.')[1], 'base64').toString();
      console.log('decodedToken');
      console.log(decodedToken);
      const parsedDeck = JSON.parse(decodedToken);
      console.log('parsedDeck');
      console.log(parsedDeck);
      return parsedDeck.deck_uuid;
    },
    authToken: (state) => state.authPayload.access_token,
    parsedAuth: (state, getters) => {
      if (getters.authToken === null) { return null; }
      const encodedAuth = getters.authToken.split('.')[1];
      const decodedAuth = Buffer.from(encodedAuth, 'base64').toString();
      const parsedAuth = JSON.parse(decodedAuth);
      return parsedAuth;
    },
    exp: (state, getters) => {
      if (!getters.parsedAuth) { return 0; }
      return getters.parsedAuth.exp;
    },
    userUUID: (state, getters) => {
      if (!getters.parsedAuth) { return null; }
      return getters.parsedAuth.sub;
    },
    userEmail: (state, getters) => {
      if (!getters.parsedAuth) { return null; }
      return getters.parsedAuth.email;
    },
    isSuperUser: (state, getters) => {
      if (!getters.parsedAuth) { return false; }
      return getters.parsedAuth.is_superuser;
    },
    isLoggedIn: (state, getters) => {
      if (!getters.parsedAuth) { return false; }
      const timeNow = Math.floor(Date.now() / 1000);
      console.log('time now');
      console.log(timeNow);
      console.log('time exp');
      console.log(getters.exp);
      return timeNow < getters.exp;
    },
  },
});


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
