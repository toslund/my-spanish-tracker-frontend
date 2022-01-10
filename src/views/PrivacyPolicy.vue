<template>
  <div class="about-section">
    <div class="about-content mt-5">
      <h1 class="text-h5 font-weight-bold policy-title">Our Policy</h1>
      <table class="privacy-table">
        <thead>
          <tr>
            <th>The Topic</th>
            <th>The Scoop</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="accent--text">
                What information TrackMySpanish collects
              </span>
            </td>
            <td>
              TrackMySpanish collects your username, email and contact settings directly from you for your
              registration. We may also directly ask you for other profile information like
              your language learning level, and name. We also
              automatically collect from you your usage information when you
              interact with the site.
            </td>
          </tr>
          <tr>
            <td>
              <span class="accent--text">
                What information TrackMySpanish does <em>not</em> collect
              </span>
            </td>
            <td>
              We  don’t collect
              <a href="https://gdpr-info.eu/art-9-gdpr/"
                >Sensitive Personal Information</a
              >. We do not use 3rd party tracking like Google Analytics. 
            </td>
          </tr>
          <tr>
            <td>
              <span class="accent--text">
                How TrackMySpanish uses your information
              </span>
            </td>
            <td>
              We use the information about your performance on
              site features, such as vocabulary assessments, to improve
              new features and build new ones. That's it.
            </td>
          </tr>
          <tr>
            <td>
              <span class="accent--text">
                How we share the information we collect
              </span>
            </td>
            <td>
              We will not share your information unless you explicitly consent.
            </td>
          </tr>
          <tr>
            <td>
              <span class="accent--text">
                Our use of cookies and tracking
              </span>
            </td>
            <td>
              We only use strictly necessary cookies to provide, secure and
              improve our service. Generally, this means only authentication information to keep you logged in.
            </td>
          </tr>
          <!-- <tr>
            <td>
              <a href="#how-we-communicate-with-you"
                >How we communicate with you</a
              >
            </td>
            <td>
              We communicate with you by email. You can control the way we
              contact you in your account settings, or by contacting us.
            </td>
          </tr> -->
          <tr>
            <td>
              <span class="accent--text">
                Changes to our Privacy Statement
              </span>
            </td>
            <td>
              We notify you of material changes to this Privacy Statement 30
              days before any such changes become effective.
            </td>
          </tr>
          <!-- <tr>
            <td><span>Contacting</span></td>
            <td>
              Please feel free to contact us if you have questions about our
              Privacy Statement.
            </td>
          </tr> -->
          <!-- <tr>
            <td><a href="#translations">Translations</a></td>
            <td>
              We provide links to some translations of the Privacy Statement.
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import Welcome from '../components/Welcome.vue';

export default {
  name: 'PrivacyPolicy',
  components: {},
  mounted() {
    console.log('in privacy policy');
  },
};
</script>
<style scoped>

.policy-title {
  padding: 1em;
}

.privacy-table {
  border-collapse: collapse;
}

.privacy-table tr {
    border-top: 1px solid #d8dee4;
}

.privacy-table th {
  padding: 1em;
}

td {
    padding: 0.75rem 0.5rem;
    border: 0;
    vertical-align: top;
}

a {
  text-decoration: none;
}

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
  .about-content {
    max-width: 50em;
  }
}

.is-flex {
  display: flex;
}

.charts-gallery {
  padding: 1em;
  display: grid;
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
