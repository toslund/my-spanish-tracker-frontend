<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card>
      <v-card-title class="justify-center font-weight-light">
        <span>
          You have   <span class="font-weight-bold"> {{ questionsToGo }} </span> questions to go
        </span>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HelpDialog',
  props: {
    questionsAnswered: { type: Number, default: 0 },
    questionsToGo: { type: Number, default: 0 },
    shouldshow: { type: Boolean },
  },
  watch: {
    dialog: {
      handler(newVal) {
        console.log(`watching dialog: ${newVal}`);
        this.$emit('update:shouldshow', newVal);
      },
    },
    shouldshow: {
      handler(newVal) {
        console.log(`watching shouldshow: ${newVal}`);
        this.dialog = newVal;
      },
    },
  },
  data: () => ({
    dialog: false,
  }),
};
</script>

<style>
</style>
