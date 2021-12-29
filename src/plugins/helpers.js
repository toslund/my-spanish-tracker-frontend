// resources/js/plugins/mixin.js
import Vue from 'vue';
import axios from 'axios';

Vue.mixin({
  methods: {
    capitalizeFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    sampleFunction() {
      alert('Global Functions');
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
