import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#AA151B',
        secondary: '#F1BF00',
        success: '#12770f',
        accent: '#aa5e15',
        accent2: '77420f',
        whiteish: 'F9F9F9',
      },
    },
  },
});

// icons: {
//     iconfont: 'mdi', // default - only for display purposes
//   },
