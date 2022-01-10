<template>
  <v-container >
    <div 
    class="content mx-auto"
    >
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
            <v-card-title class='black--text text--darken-4'><span>Click<span class="green--text darken-1">{{ ' YES '}}</span>if:</span></v-card-title>
            <v-card-text>
              <li class='text-subtitle-2 text--primary'>
                You have mastered this word
              </li>
              <li class='text-subtitle-2 text--primary'>
                You are not relying on it being a cognate
              </li>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn
                color="success"
                @click="shownKnowWordDialog = true; dialogKnowWord = false; skipReveal(true);"
              >
                Makes sense
              </v-btn>
              <v-btn
                color="error"
                text
                 @click="shownKnowWordDialog = true; dialogKnowWord = false"
              >
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          id="maybeKnowWordCheck"
          v-model="dialogMaybeKnowWord"
          max-width="500"
        >
          <v-card>
            <v-card-title class='black--text text--darken-4'><span>Click<span class="warning--text darken-1">{{ ' MAYBE '}}</span>if:</span></v-card-title>
            <v-card-text>
              <li class='text-subtitle-2 text--primary'>
                You are unsure if you know it
              </li>
              <li class='text-subtitle-2 text--primary'>
                You want to check the definition
              </li>
              <li class='text-subtitle-2 text--primary'>
                You know it, but have not mastered it
              </li>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn
                color="success"
                @click="shownMaybeKnowWordDialog = true; dialogMaybeKnowWord = false; doReveal(true);"
              >
                Makes sense
              </v-btn>
              <v-btn
                color="error"
                text
                 @click="shownMaybeKnowWordDialog = true; dialogMaybeKnowWord = false"
              >
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          id="dontKnowWordCheck"
          v-model="dialogDontKnowWord"
          max-width="500"
        >
          <v-card>
            <v-card-title class='black--text text--darken-4'><span>Click<span class="error--text darken-1">{{ ' NO '}}</span>if:</span></v-card-title>
            <v-card-text>
              <li class='text-subtitle-2 text--primary'>
                <span >You do not know the word</span>
              </li>
              <li class='text-subtitle-2 text--primary'>
                <span>You can only guess or infer it's meaning</span>
              </li>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn
                color="success"
                @click="shownDontKnowWordDialog = true; dialogDontKnowWord = false; doReveal(false);"
              >
                Makes sense
              </v-btn>
              <v-btn
                color="error"
                text
                 @click="shownDontKnowWordDialog = true; dialogDontKnowWord = false"
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
                @click="dialogConfirmDontKnowWord = false; question.correct = false; nextQuestion();"
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
            @click="!shownKnowWordDialog ? dialogKnowWord = true : skipReveal(true)"
          >
            Yes
          </v-btn>
          <v-btn
            text
            outlined
            color='warning'
            @click="!shownMaybeKnowWordDialog ? dialogMaybeKnowWord = true : doReveal(true)"
          >
            Maybe
          </v-btn>
          <v-btn
            text
            outlined
            color='error'
            @click="!shownDontKnowWordDialog ? dialogDontKnowWord = true : doReveal(false)"
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
            class="large-font px-3"
            color="blue"
            track-color="blue-lighten-3"
            :thumb-color="'blue lighten-1'"
            :error="question.familiarity === 0 && sliderClicked === false"
            @change="question.familiarity > 0 ? question.correct = true : question.correct = false"
            :hint="sliderClicked ? sliderHints[question.familiarity] : `${sliderHints[question.familiarity]} - Drag slider or click bar`"
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
// import Cookies from 'js-cookie';
import axios from 'axios';
import HelpDialog from './HelpDialog.vue';
import ProgressDialog from './ProgressDialog.vue';

export default {
  name: 'Assessment',
  components: { HelpDialog, ProgressDialog },
  props: ['uuiddeck'],
  methods: {
    refresh() {
      console.log('trying to refresh');
      this.initAssessment();
    },
    nextQuestion() {
      console.log('NEXT QUESTION');
      if (this.assessment.questions_queue.length === 0) {
        // the assessment is finished
        console.log('ASSESSMENT FINISHED');

        this.$emit('completed', this.deckUUID);

        this.getDeckAssessment(this.deckUUID).then((response) => {
          this.assessment = response.data;
          if (this.assessment.questions_queue.length > 0) {
            // the assessment is acutally not finished
            this.nextQuestion(); 
          } else {
            this.assessing = false;
            this.doneAssessing = true;
            this.dialogDeckAssessment = true;
          }
        });
      } else if (this.question.uuid !== null) {
        // there is a question - try to post it
        this.postQuestion().then((response) => response).then(() => {
          Object.assign(this.question, this.dummyQuestion);
          this.reveal = false;
          this.nextQuestion();
        }).catch((error) => {
          console.log('could not post question');
          console.log(error);
          this.assessing = false;
          this.somethingsWrong = true;
        });
        // performed async with post call to avoid a screen flash
        // this.reveal = false;
        // Object.assign(this.question, this.dummyQuestion);
      } else {
        // There is no question, get a new one
        this.getQuestion().then((response) => {
          this.question = response.data;
        });
        this.reveal = false;
      }
    },
    skipReveal() {
      this.question.recognize = true;
      this.question.correct = true;
      this.question.familiarity = 5;
      this.nextQuestion();
    },
    doReveal(doesKnow) {
      this.question.recognize = doesKnow;
      if (!doesKnow) {
        this.question.correct = doesKnow;
        this.question.familiarity = 0;
        this.nextQuestion();
      } else {
        this.questionsAnsweredCorrectly.push(this.question.uuid);
        this.reveal = true;
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
    async getDeck() {
      console.log('getting deck');
      console.log(`${this.deckEndpoint}/${this.deckUUID}`);
      // const url = new URL(this.deckEndpoint);
      const response = await axios.get(`${this.deckEndpoint}/${this.deckUUID}`);
      console.log(`length of questions rom fetched deck: ${response.data.questions_queue.length}`);
      console.log(response);
      return response;
    },
    async getQuestion() {
      console.log('getting question');
      const vocabUUID = this.assessment.questions_queue.pop();
      this.questionsAnswered.push(vocabUUID);
      console.log(`${this.deckEndpoint}/${this.deckUUID}/question`);
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
      console.log(`${this.deckEndpoint}/${this.deckUUID}/question/${this.question.uuid}`);
      // const url = new URL(this.deckEndpoint);
      console.log('awaiting axios?');
      const response = await axios.post(
        `${this.deckEndpoint}/${this.deckUUID}/question/${this.question.uuid}`, this.question,
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
      if (!this.deckUUID) {
        console.log('will try to create deck');
        this.createDeck(this.$store.getters.userUUID).then((response) => {
          this.deckUUID = response.data.deck.uuid;
          console.log('DECK UUIDDDDDDD');
          console.log(this.deckUUID);
          return this.getDeckAssessment(this.deckUUID);
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
        console.log('IN ELSEEEE');
        console.log(this.deckUUID);
        this.getDeckAssessment(this.deckUUID)
          .then((response) => {
            this.assessment = response.data;
            this.somethingsWrong = false;
          })
          .catch((error) => {
            if (!error.response) {
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
      deckUUID: null,
      assessing: false,
      cardConfirmContinueAssessment: false,
      somethingsWrong: false,
      doneAssessing: false,
      dialogDeckAssessment: false,
      dialogHelp: false,
      shownKnowWordDialog: false,
      shownMaybeKnowWordDialog: false,
      shownDontKnowWordDialog: false,
      dialogKnowWord: false,
      dialogMaybeKnowWord: false,
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
        questions_queue: [],
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
          word: ' ',
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
      return this.assessment.questions_queue.length;
    },
  },
  created() {
    this.deckUUID = this.uuiddeck;
    console.log('creating component');
    console.log(this.deckUUID);
  },
  mounted() {
    console.log('in mounted');
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
