<template>
  <div class="main-container">
    <sign-up-dialog v-if="signUpDialog" v-model="signUpDialog"></sign-up-dialog>
    <deck-assessment v-if="step === 'analyzeAssessment'" v-model="dialogDeckAssessment" :uuiddeck="deckUUID"/>
    <assessment-quiz v-if="step === 'assessing'" :uuiddeck="deckUUID" @completed="handleCompleted"></assessment-quiz>
    <div v-if="!isLoggedIn" class="centered-column">
      <div class="main-container">
      <div class="centered-column">
        <h1 class="text-h5">
         You're not logged in, but don't worry...
        </h1>
      </div>
      <div class="main-container mt-3">
        <div class="centered-content">
          <v-btn
          color="success"
          @click="signUpDialog = true"
          >
          Sign Up
          </v-btn>
        </div>
        <div class="text-subtitle-2 centered-text">
            Free. Save your results.
        </div>
      </div>
      <div class="main-container mt-3">
        <div class="centered-content">
          <v-btn
          color="warning"
          @click="createAnonymousUser()"
          >
            Continue As Guest
          </v-btn>
        </div>
        <div class="text-subtitle-2 centered-text">
            Your results won't be saved.
        </div>
      </div>
      </div>
    </div>
    <div v-if="!decksLoading && step === 'chooseDeck'" class="main-container">
      <div class="centered-column table-wrapper">
        <h1 class="text-h5 decks-title">
         My Assessments 
        </h1>
      <v-simple-table max-width="500">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Date
              </th>
              <th class="text-left">
                Status
              </th>
              <th>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deck in decks"
              :key="deck.deck.uuid"
            >
              <td>{{ formattedDate(deck.deck.date_added) }}</td>
              <td>{{ deck.assessment.questions_queue.length === 0 ? 'Complete' : 'In progress'}}</td>
              <td>
                <v-btn
                  v-if="deck.assessment.questions_queue.length < 1"
                  @click="deckUUID=deck.deck.uuid; step = 'analyzeAssessment'"
                  >
                  Show
                </v-btn>
                <v-btn
                  v-if="deck.assessment.questions_queue.length > 0"
                  @click="deckUUID=deck.deck.uuid; step = 'assessing'"
                  >
                  Resume
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
       <div class="flex-container mt-5">
        <v-btn
          class="centered-content"
          color="success"
          @click="step='assessing';"
          >
          New Assessment
        </v-btn>
      </div>
      </div>
      </div>
  </div>
</template>

<script>
import SignUpDialog from '../components/SignUpDialog.vue';
import AssessmentQuiz from '../components/AssessmentQuiz.vue';
import DeckAssessment from '../components/DeckAssessment.vue';

export default {
  name: 'AssessmentView',

  components: {
    SignUpDialog,
    AssessmentQuiz,
    DeckAssessment,
  },
  data() {
    return {
      step: null,
      decks: [],
      decksLoading: true,
      signUpDialog: false,
      doneAssessing: false,
      dialogDeckAssessment: false,
      deckUUID: null,
    };
  },
  computed: {
    isSuperUser() {
      return this.$store.getters.isSuperUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    authToken() {
      return this.$store.getters.authToken;
    },
    userUUID() {
      return this.$store.getters.userUUID;
    },
  },
  watch: {
    dialogDeckAssessment(newVal) {
      if (newVal === false) {
        this.step = 'chooseDeck';
      }
    },
    step(newVal) {
      if (newVal === 'analyzeAssessment') {
        this.dialogDeckAssessment = true;
      } else if (newVal === 'chooseDecks') {
        this.initChooseDecks();
      }
    },
  },
  methods: {
    handleCompleted(e) {
      console.log('in handle completed');
      console.log(e);
      this.deckUUID = e;
      this.step = 'analyzeAssessment';
    },
    createAnonymousUser() {
      this.signUp(null, null, '')
        .then((response) => {
          console.log(response);
          this.$store.commit('setAuthToken', response.data.token);
          this.step = 'assessing';
          this.showDialog = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          this.error = error.response.data.detail;
        });
    },
    initChooseDecks() {
      console.log('will get owners decks');
      this.decksLoading = true;
      this.getOwnersDecks(this.userUUID).then((response) => {
        this.decks = response.data;
        this.step = 'chooseDeck';
        this.decksLoading = false;
      });
    },
  },
  created() {
  },
  mounted() {
    console.log('in mounted');
    console.log(this.isLoggedIn);
    if (!this.isLoggedIn) {
      console.log('not logged in');
    } else {
      this.step = 'chooseDecks';
    }
  },
};
</script>
<style>

.table-wrapper {
  max-width: 400px;
}
.main-container {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
}

.centered-column {
  justify-self: center;
  align-self: center;
}
.centered-column.is-centered{
  display: grid;
}

.flex-container {
  display: flex;
}
.centered-content {
  margin: auto;
}

.centered-text {
  text-align: center;
}
.decks-title {
  border-bottom: 1px solid #AA151B;
  text-align: center;
}
</style>
