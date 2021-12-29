<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card v-if="foo=='step1'">
      <v-card-title class='black--text text--darken-4'>You know this word if:</v-card-title>
      <v-card-text>
        <li class='text-subtitle-2 text--primary'>
          <span class="green--text darken-1">You can translate it confidently</span>
        </li>
        <li class='text-subtitle-2 text--primary'>
          <span class="green--text darken-1">You are not relying on it being a cognate</span>
        </li>
      </v-card-text>

      <v-card-title class='black--text text--darken-4'>You don't know this word if:</v-card-title>
      <v-card-text>
        <li class='text-subtitle-2 text--primary'>
          <span class="red--text darken-1">You can't translate it</span>
        </li>
        <li class='text-subtitle-2 text--primary'>
          <span class="red--text darken-1">You wouldn't be able to use this word while communicating</span>
        </li>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn
          color="success"
          @click="shouldshow=$emit('update:shouldshow', false)"
        >
          Got it
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <v-card v-if="foo=='step2'">
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>1. Review the definitions of the word</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>2. Drag the slider to show how well you know the word</v-list-item-title>
            <v-list-item-subtitle class="ml-5 pa-1">Leave it on the left if you actually <span class="text-black font-weight-bold">don't know the word</span></v-list-item-subtitle>
            <v-list-item-subtitle class="ml-5 pa-1">All the way to right means you <span class="font-weight-bold">have mastered the word</span></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          color="success"
          @click="shouldshow=$emit('update:shouldshow', false)"
        >
          Got it
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HelpDialog',
  props: { foo: { type: String, default: 'foobar' }, shouldshow: { type: Boolean } },
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
