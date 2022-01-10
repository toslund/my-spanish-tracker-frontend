// resources/js/plugins/mixin.js
import Vue from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

Vue.mixin({
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
  },
  methods: {
    capitalizeFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    sampleFunction() {
      alert('Global Functions');
    },
    formattedDate(inputDate) {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      const date = new Date(inputDate).toLocaleDateString('en-EN', options);
      return date;
    },
    async getDeckAssessment(deckUUID) {
      console.log('getting deck assessment');
      console.log(deckUUID);
      const url = new URL(`${process.env.VUE_APP_API_URL}/decks/${deckUUID}/assessment`);
      // const url = new URL(this.deckEndpoint);
      const headers = this.isLoggedIn ? { Authorization: `Bearer ${this.authToken}` } : null;
      const options = {
        method: 'GET',
        headers,
        url, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async getOwnersDecks(userUUID) {
      console.log('creating deck');
      // const url = new URL(this.deckEndpoint);
      
      const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.authToken}` },
        url: `${process.env.VUE_APP_API_URL}/users/${userUUID}/decks`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async createDeck(userUUID) {
      console.log('creating deck in helpers');
      console.log(userUUID);
      const deckUUID = uuidv4();
      const payload = {
        uuid: deckUUID,
        owner_uuid: userUUID,
        name: process.env.VUE_APP_CODE,
        email: '',
      };
      console.log('creating deck');
      // const url = new URL(this.deckEndpoint);
      
      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.authToken}` },
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/decks/${deckUUID}`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async confirmEmail(token) {
      const payload = {
        token,
      };
      console.log('confirming email');    
      const options = {
        method: 'POST',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/users/confirm-email`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async signUp(email, password, fullName) {
      const uuid = uuidv4();
      let userEmail = email;
      let userPassword = password;
      if (userEmail === null) {
        console.log('creating anonymous user'); 
        userEmail = `u+${uuid}@${process.env.VUE_APP_EMAIL_DOMAIN}`;
        userPassword = uuidv4();
      } else {
        console.log('creating user'); 
      }
      const payload = {
        email: userEmail,
        password: userPassword,
        uuid,
        full_name: fullName,
        username: '',
        leave_blank: process.env.VUE_APP_CODE,
      };
      const options = {
        method: 'POST',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/users/open`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async getAuthToken(username, password) {
    //   const payload = { username, password, grant_type: 'password' };
      const loginFormData = new FormData();
      loginFormData.append('username', username);
      loginFormData.append('password', password);
      loginFormData.append('grant_type', 'password');
      console.log('getting token');
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: loginFormData,
        url: `${process.env.VUE_APP_API_URL}/login/access-token`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
  },
});
