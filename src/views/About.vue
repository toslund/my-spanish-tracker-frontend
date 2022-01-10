<template>
  <div class="about-section">
  <div class="about-content mt-5">
    <h1 class="text-h6">How many words do I need to know? </h1>
    <p> This is a simple question but it has important implications for langauge learning.
      The answer varies based on several factors. Researchers estimate that native speakers
      know between 15,000 and 20,000 word families or lemmas. That's a very high bar for langague learners.
    </p>
    <p>
      The good news though, is that Stuart Webb, professor of applied linguistics 
      <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2009.00509.x">found</a> that, in English, knowing the 3,000
      most common lemmas provides 95% coverage in television programs. Knowing the next 5,000 lemmas
      will only push that coverage up to 98%.
    </p>
    <p>
      According to this data, there should be diminishing gains after words 8-10 thousand.
    </p>
    <p>
      So what happens when we assess different spanish speakers' knowledge of the top 10,000 words with TrackMySpanish?
    </p>
    <div class="is-flex charts-section">
      <div class="charts-gallery">
        <div class="chart">
          <h1 class="text-subtitle-2 text-black centered-text"> Elementary Speaker</h1>
          <bins-chart :bins="$options.beginnerSpeakerBins" canvasid="beginner-chart"></bins-chart>
        </div>
        <div class="chart">
          <h1 class="text-subtitle-2 text-black centered-text"> Intermediate Speaker</h1>
          <bins-chart :bins="$options.inermediateSpeakerBins" canvasid="intermediate-chart"></bins-chart>
        </div>
        <div class="chart">
          <h1 class="text-subtitle-2 text-black centered-text"> Native Speaker</h1>
          <bins-chart :bins="$options.nativeSpeakerBins" canvasid="native-chart"></bins-chart>
        </div>
      </div>
    </div>
    <p>
      What we can expect is that a native or fluent speaker should know all of top 10,000 words.
      Although this is a given for a native speaker, the same feat for a langauge learner would provide
      excellent
    </p>
    <h1 class="text-h6">Does word recognition always equate to fluency?</h1>
    <p> No. Fluency is a complex and multifaceted. A speaker could have a large vocabulary but lack verbal or
      grammatical skills. So, in theory, you could have a large vocabulary but a low level of fluency, although in
      practice this is rare. The inverse, however, is not true.
      If you have a native or other high level of fluency in spanish than you know these words.
    </p>
    <h1 class="text-h6">What does this mean for me?</h1>
    <p>
      First, it means that you have a benchmark for one important piece of fluency: vocabulary.
    </p>
    <p>
      Second, it means that you have an efficient way of studying the words you need to know. After you take
      an assessment, you know where you need to target your efforts.
    </p>
    <h1 class="text-h6">Future plans</h1>
    <p>
      At TrackMySpanish the "royal we" have a broad range of study tools planned based
      on the philosophy of studying smarter and quantifying progress. These will not just stop at
      vocabulary, but will also include grammar and other important aspects as well. Stay tuned!
    </p>
  </div>
  </div>
</template>

<script>
// import Welcome from '../components/Welcome.vue';
import BEGINNER_SPEAKER_BINS_JSON from '@/json/beginner_bins.json';
import INTERMEDIATE_SPEAKER_BINS_JSON from '@/json/intermediate_bins.json';
import NATIVE_SPEAKER_BINS_JSON from '@/json/native_bins.json';
import BinsChart from '../components/BinsChart.vue';

export default {
  name: 'Home',
  beginnerSpeakerBins: BEGINNER_SPEAKER_BINS_JSON,
  inermediateSpeakerBins: INTERMEDIATE_SPEAKER_BINS_JSON,
  nativeSpeakerBins: NATIVE_SPEAKER_BINS_JSON,
  components: {
    BinsChart,
  },
};
</script>
<style scoped>

.about-section {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  width: 100%;
}

.about-content {
  margin-left: 1em;
  margin-right: 1em;
}

@media (min-width: 50em) {
  .about-content  {
    max-width: 50em;
  }
}

.is-flex {
  display: flex;
}

.charts-gallery {
  padding: 1em;
  display:grid;
  max-width: 1200px;
  justify-content: center;
  gap: 1em;
  flex-grow: 1;
  margin: auto;
}


.chart {
  min-width: 0;
}

.centered-text {
  text-align: center;
}

@media (min-width: 1000px) {
  .charts-gallery {
    padding: 2em;
    grid-template-columns: 1fr 1fr;
  }
}

</style>
