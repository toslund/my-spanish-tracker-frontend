<template>
  <v-container >
    <div 
    class="content mx-auto"
    >
      <v-card
        class='quiz-card mx-auto'
        max-width="500"
        justify="center"
        v-if="cardConfirmContinueAssessment"
      >
        <v-card-title class='justify-center black--text text--darken-4'>Continue with your assessment?</v-card-title>
        <v-card-text class="text-center">
          You have {{ totalQuestionsToGo }} questions to go.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="success"
            @click="handleContinueAssessment"
          >
            Continue
          </v-btn>
          <v-btn
            color="error"
            @click="resetDeck(); cardConfirmContinueAssessment=false;"
          >
            Start Over
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        class='quiz-card mx-auto'
        max-width="500"
        justify="center"
        v-if="somethingsWrong"
      >
        <v-card-title class='justify-center black--text text--darken-4'>Something went wrong...</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn
            @click="refresh"
          >
            Try Again
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-progress-linear
      v-if="assessing"
      color="accent"
      :value="(totalQuestionsAnswered/(totalQuestionsAnswered+totalQuestionsToGo))*100"></v-progress-linear>
      <v-card
        class='quiz-card mx-auto'
        max-width="500"
        justify="center"
        v-if="assessing"
      >
      <v-dialog
          id="knowWordCheck"
          v-model="dialogKnowWord"
          max-width="500"
        >
          <v-card>
            <v-card-title class='black--text text--darken-4'>You know this word if:</v-card-title>
            <v-card-text>
              <li class='text-subtitle-2 text--primary'>
                <span class="green--text darken-1">You can translate it confidently</span>
              </li>
              <li class='text-subtitle-2 text--primary'>
                <span class="green--text darken-1">You are not relying on it being a cognate</span>
              </li>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn
                color="success"
                @click="doReveal(true); dialogKnowWord = false;"
              >
                Makes sense
              </v-btn>
              <v-btn
                color="error"
                text
                 @click="dialogKnowWord = false"
              >
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          id="knowWordCheck"
          v-model="dialogDontKnowWord"
          max-width="500"
        >
          <v-card>
            <v-card-title class='black--text text--darken-4'>You don't know this word if:</v-card-title>
            <v-card-text>
              <li class='text-subtitle-2 text--primary'>
                <span class="green--text darken-1">You can translate it confidently</span>
              </li>
              <li class='text-subtitle-2 text--primary'>
                <span class="green--text darken-1">You are not relying on it being a cognate</span>
              </li>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn
                color="success"
                @click="doReveal(false); dialogDontKnowWord = false;"
              >
                Makes sense
              </v-btn>
              <v-btn
                color="error"
                text
                 @click="dialogKnowWord = false"
              >
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          id="confirmDontKnowWord"
          v-model="dialogConfirmDontKnowWord"
          max-width="500"
        >
          <v-card>
            <v-card-actions class="justify-center">
              <v-btn
                color="error"
                @click="nextQuestion(); confirmDontKnowWord = false;"
              >
                I don't know this word
              </v-btn>
              <v-btn
                text
                 @click="dialogConfirmDontKnowWord = false"
              >
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card-title class='justify-center text-h4'>{{ question.vocab.word }}</v-card-title>
        <div id="prompt" v-show="!reveal">
          <v-card-title class='justify-center text-h6'>Do you know this word?</v-card-title>
          <v-card-actions class="justify-center" v-show='!reveal'>
          <v-btn
            text
            outlined
            color='success'
            @click="showKnowWordDialog ? dialogKnowWord = true : doReveal(true)"
          >
            Yes
          </v-btn>
          <v-btn
            text
            outlined
            color='error'
            @click="showDontKnowWordDialog ? dialogDontKnowWord = true : doReveal(false)"
          >
            No
          </v-btn>
        </v-card-actions>


        </div>
        <div id="questions" v-show="reveal">

          <v-card-text>
          <p class='text-subtitle-2 text--lighten'>
            {{question.vocab.pos}}
          </p>
          <p v-for="(definition, idx) in question.vocab.definitions" :key="idx" class='text-h6 text--primary'>
            {{idx + 1}}. <span class="blue--text darken-1">{{ definition.content}}</span>
          </p>
          <v-card-text class='text-center text--primary'>
          <p class='justify-center text-subtitle-1 text--darken'>
            How well do you know this word?
          </p>
          <v-slider
            class="large-font"
            :error="question.familiarity === 0 && sliderClicked === false"
            :rules="rules"
            @mousedown="sliderClicked=true; sliding=true"
            @mouseup="sliding=false"
            :hint="sliderHints[question.familiarity]"
            v-model="question.familiarity"
            step="1"
            min=0
            max=5
            ticks="always"
            tick-size="5"
            :thumb-label="showThumb()"
            :thumb-size="100"
            persistent-hint
          >
          <template class="large-font" v-slot:thumb-label="item">
            {{ satisfactionEmojis[item.value] }}
          </template>
          </v-slider>
          </v-card-text>
          </v-card-text>

          <v-card-actions class='pt-0 justify-center' v-if='reveal'>
          <v-btn
            color='Primary'
            @click="question.familiarity ? nextQuestion() : dialogConfirmDontKnowWord = true"
          >
            Next
          </v-btn>
        </v-card-actions>


        </div>
        <v-card-text class='text-center'>
      
        </v-card-text>
          <!-- <p>{{ currentQuestion.vocab.definitions[0].content}}</p> -->

        
      <!-- </v-expand-transition> -->
    <v-container>
      <v-row >
    <v-spacer></v-spacer>
     <v-icon class="pa-1"  @click="dialogProgress=true">
      mdi-progress-clock
    </v-icon>
    <v-icon class="pa-1" @click="dialogHelp=true">
      mdi-help-circle
    </v-icon>
    </v-row>
    </v-container>
      </v-card>
      <v-card
        class='quiz-card mx-auto'
        max-width="500"
        justify="center"
        v-if="doneAssessing"
      >
        <!-- <v-card-title class='justify-center text-h4'>You finished!</v-card-title> -->
        <v-card-text class=text-center>
          <v-card-title class='justify-center text-h6'>
            <span>You have an estimated vocabulary of:<br> <span class="font-weight-bold"> {{this.assessment.prediction.total_predicted_correct}} words</span></span>
          </v-card-title>
          <!-- <v-progress-circular
            :rotate="180"
            :size="100"
            :width="15"
            :value="(assessment.prediction || .65)*100"
            color="pink"
          >
            {{(assessment.prediction || .65)*100}}%
          </v-progress-circular> -->
        </v-card-text>
      </v-card>
    <pre v-if="isSuperUser">{{ assessment }}</pre>
    </div>
  <progress-dialog 
    :questions-answered="totalQuestionsAnswered"
    :questions-to-go="totalQuestionsToGo"
    :shouldshow="dialogProgress"
    @update:shouldshow="dialogProgress = ($event)"
  ></progress-dialog>
  <help-dialog :foo="reveal ? 'step2' : 'step1'" :shouldshow="dialogHelp" @update:shouldshow="dialogHelp = ($event)"></help-dialog>
  </v-container>
</template>

<script>
// import Welcome from '../components/Welcome.vue';
import { v4 as uuidv4 } from 'uuid';
// import Cookies from 'js-cookie';
import axios from 'axios';
import HelpDialog from '../components/HelpDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

export default {
  name: 'Assessment',
  components: { HelpDialog, ProgressDialog },
  methods: {
    handleContinueAssessment() {
      this.cardConfirmContinueAssessment = false;
      this.assessing = true;
      this.nextQuestion();
    },
    refresh() {
      console.log('trying to refresh');
      this.initAssessment();
    },
    nextQuestion() {
      console.log('NEXT QUESTION');
      if (this.assessment.questions.length === 0 && this.assessment.prediction !== null) {
        // the assessment is finished
        console.log('ASSESSMENT FINISHED');
        this.getDeckAssessment().then((response) => {
          this.assessment = response.data;
          if (this.assessment.questions.length > 0) {
            // the assessment is acutally not finished
            this.nextQuestion(); 
          } else {
            this.assessing = false;
            this.doneAssessing = true;
          }
        });
      } else if (this.question.uuid !== null) {
        // there is a question - try to post it
        this.postQuestion().then((response) => response).then(() => {
          this.nextQuestion();
        }).catch((error) => {
          console.log('could not post question');
          console.log(error);
          this.$forceUpdate();
        });
        // performed async with post call to avoid a screen flash
        this.reveal = false;
        Object.assign(this.question, this.dummyQuestion);
      } else {
        // There is no question, get a new one
        this.getQuestion().then((response) => {
          this.question = response.data;
        });
        this.reveal = false;
      }
    },
    doReveal(doesKnow) {
      this.question.correct = doesKnow;
      if (!doesKnow) {
        this.question.familiarity = 0;
        this.nextQuestion();
      } else {
        this.questionsAnsweredCorrectly.push(this.question.uuid);
        this.reveal = true;
      }
    },
    pushThroughOverlay(overlayName, action, arg, spend) {
      if (overlayName in this.overlays && !this.overlays[overlayName].spent) {
        this.currentOverlayKey = overlayName;
        this.overlayHelper = true;
        this.overlayAction = function overlayAction() {
          action(arg);
        };
        if (spend) {
          this.overlays[overlayName].spent = true;
        }
      } else {
        action(arg);
      }
    },
    showThumb() {
      if (this.question.familiarity > 0 && this.sliding) {
        return true;
      }
      return false;
    },
    notZero(num) {
      return num > 4;
    },
    async createDeck() {
      const deckUUID = uuidv4();
      const payload = {
        uuid: deckUUID,
        owner_uuid: this.userUUID,
        name: process.env.VUE_APP_CODE,
        email: '',
      };
      console.log('creating deck');
      // const url = new URL(this.deckEndpoint);
      
      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.authToken}` },
        data: payload,
        url: `${this.deckEndpoint}/${deckUUID}`, 
      };
      const response = await axios(
        options,
      );
      return response;
    },
    async getDeck() {
      console.log('getting deck');
      console.log(`${this.deckEndpoint}/${this.savedDeckUUID}`);
      // const url = new URL(this.deckEndpoint);
      const response = await axios.get(`${this.deckEndpoint}/${this.savedDeckUUID}`);
      console.log(`length of questions rom fetched deck: ${response.data.questions.length}`);
      console.log(response);
      return response;
    },
    async getDeckAssessment() {
      console.log('getting deck assessment');
      const url = new URL(`${this.deckEndpoint}/${this.savedDeckUUID}/assessment`);
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
    async getQuestion() {
      console.log('getting question');
      const vocabUUID = this.assessment.questions.pop();
      this.questionsAnswered.push(vocabUUID);
      console.log(`${this.deckEndpoint}/${this.savedDeckUUID}/question`);
      // const url = new URL(this.deckEndpoint);
      console.log('awaiting axios?');
      const url = new URL(`${this.deckEndpoint}/${this.assessment.deck_uuid}/question`);
      url.searchParams.set('vocab_uuid', vocabUUID);
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
    async postQuestion() {
      console.log('creating question');
      console.log(`${this.deckEndpoint}/${this.savedDeckUUID}/question/${this.question.uuid}`);
      // const url = new URL(this.deckEndpoint);
      console.log('awaiting axios?');
      const response = await axios.post(
        `${this.deckEndpoint}/${this.savedDeckUUID}/question/${this.question.uuid}`, this.question,
      );
      return response;
    },
    // getVocabs() {
    //   console.log('requesting verbs');
    //   const url = new URL(this.deckEndpoint);
    //   axios.get(url).then((response) => {
    //     this.vocabs = response.data.vocabs;
    //     // this.vocabs.push(...response.data.vocabs);
    //     this.totalVocabs = response.data.total_count;
    //   });
    // },
    itemRowBackground(item) {
      return item.lemma.rank % 2 ? 'cell-odd' : 'cell-even';
    },
    initAssessment() {
      // this.getVocabs();
      if (this.savedDeckUUID === null) {
        console.log('will try to create deck');
        this.createDeck().then((response) => {
          this.$store.commit('setDeck', response.data.deck_token);
          return this.getDeckAssessment();
        }).then((response) => {
          this.assessment = response.data;
          this.assessing = true;
          this.nextQuestion();
        }).catch((error) => {
          if (!error.status) {
          // network error
            console.log('network error');
            this.somethingsWrong = true;
            console.log(error);
          } else {
            console.log(error);
            console.log(error.response);
            this.error = error.response.data.detail;
          }
        });
      } else {
        this.getDeckAssessment()
          .then((response) => {
            this.assessment = response.data;
            this.cardConfirmContinueAssessment = true;
            this.somethingsWrong = false;
          })
          .catch((error) => {
            if (!error.status) {
              // network error
              console.log('network error');
              this.somethingsWrong = true;
              console.log(error);
            } else if (error.response.data.detail === 'Deck not found') {
              console.log('deck not found');
              this.resetDeck();
            }
          });
      // .then(() => { this.questionIndex = this.questions.length - 1; });
      }
    },
    resetDeck() {
      this.$store.commit('removeSavedDeck');
      this.initAssessment();
    },
  },
  watch: {
    options: {
      handler() {
        this.getVocabs();
      },
      deep: true,
    },
  },
  data() {
    return {
      assessing: false,
      cardConfirmContinueAssessment: false,
      somethingsWrong: false,
      doneAssessing: false,
      dialogHelp: false,
      dialogKnowWord: false,
      dialogDontKnowWord: false,
      dialogConfirmDontKnowWord: false,
      dialogProgress: false,
      assessment: {
        deck_uuid: null,
        bins: [
          {
            correct: [],
            total: [],
            choose: 0,
            sample_size: 0,
          },
        ],
        questions: [],
        prediction: null,
      },
      overlays: {
        dummy: {
          spent: true,
          prompt: '',
          bullets: [],
          buttons: ['', ''],
        },
        confirmDontKnow: {
          spent: false,
          prompt: null,
          bullets: [],
          buttons: ["I don't know this word", 'Go back'],
        },
        firstPrompt: {
          spent: false,
          prompt: 'You know this word if:',
          bullets: [
            'You can translate it confidently',
            'You are not relying on it being a cognate',
          ],
          buttons: ['Makes sense', 'Go back'],
        },
        secondPrompt: {
          spent: false,
          prompt: 'Say that you do not know this word if:',
          bullets: [
            "You can't translate it",
            "You wouldn't be able to use this word while communicating",
          ],
          buttons: ['Got it', 'Go back'],
        },
      },
      overlayAction: function overlayAction() {
        console.log('overlayAction triggered');
      },
      overlayHelper: false,
      currentOverlayKey: '',
      sliding: false,
      sliderClicked: false,
      sliderMoved: 0,
      sliderHints: [
        "I actually don't think I know it",
        'I barely know it',
        '',
        '',
        '',
        "I've mastered it",
      ],
      reveal: false,
      rules: [
        () => { console.log('rules fired'); return this.sliderClicked || `${this.sliderHints[0]} - drag slider or click bar`; },
      ],
      satisfactionEmojis: ['😭', '😢', '🙁', '😐', '🙂', '😄'],
      currentQuesion: 0,
      questionsAnswered: [],
      questionsAnsweredCorrectly: [],
      question: {
        uuid: null,
        correct: true,
        recognize: null,
        correctness: null,
        familiarity: null,
        deck_uuid: null,
        vocab_uuid: null,
        vocab: {
          uuid: null,
          word: null,
          pos: null,
          note: null,
          lemma: {
            word: null,
            pos: null,
            rank: null,
            note: null,
          },
          definitions: [
            {
              content: null,
              rank: null,
              region: null,
              note: null,
            },
          ],
        },
      },
      dummyQuestion: {
        uuid: null,
        correct: true,
        recognize: null,
        correctness: null,
        familiarity: null,
        deck_uuid: null,
        vocab_uuid: null,
        vocab: {
          uuid: null,
          word: null,
          pos: null,
          note: null,
          lemma: {
            word: null,
            pos: null,
            rank: null,
            note: null,
          },
          definitions: [
            {
              content: null,
              rank: null,
              region: null,
              note: null,
            },
          ],
        },
      },
      totalVocabs: 0,
      options: {},
      deckEndpoint: `${process.env.VUE_APP_API_URL}/decks`,
      vocabs: [],
      pageCount: null,
    };
  },
  computed: {
    showKnowWordDialog() {
      if (this.totalQuestionsAnsweredCorrectly > 0) {
        return false;
      }
      return true;
    },
    showDontKnowWordDialog() {
      if ((this.totalQuestionsAnswered - this.totalQuestionsAnsweredCorrectly) > 0) {
        return false;
      }
      return true;
    },
    totalQuestionsAnswered() {
      console.log('computing totalQuestionsAnswered');
      let total = 0;
      this.assessment.bins.forEach((bin) => {
        total += bin.total.length;
      });
      total += this.questionsAnswered.length;
      return total;
    },
    totalQuestionsAnsweredCorrectly() {
      console.log('computing totalQuestionsAnsweredCorrectly');
      let total = 0;
      this.assessment.bins.forEach((bin) => {
        total += bin.correct.length;
      });
      total += this.questionsAnsweredCorrectly.length;
      return total;
    },
    totalQuestionsToGo() {
      console.log('computnig totalQuestionsToGo');
      return this.assessment.questions.length;
    },
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
    // a computed getter
    savedDeckUUID() {
      return this.$store.getters.getDeckUUID;
    },
    savedDeckToken() {
      return this.$store.getters.getDeckToken;
    },
    currentOverlay() {
      if (this.currentOverlayKey in this.overlays) {
        return this.overlays[this.currentOverlayKey];
      }
      return this.overlays.dummy;
    },
  },
  mounted() {
    this.initAssessment();
  },
};
</script>
<style >
.v-slider__thumb-label {
  font-size: 50px !important;
}

/* .large-font * {
   font-size: 50px;
} */

.content {
  max-width: 500px;
}

.hide-content {
  opacity: 0
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}

.top-card {
  bottom: 0;
  position: absolute;
  opacity: 1 !important;
  width: 100%;
}

.cell-even {
  background-color: #f2f1eb;
}
.cell-odd {
  background-color: #faf9f5;
}
</style>
