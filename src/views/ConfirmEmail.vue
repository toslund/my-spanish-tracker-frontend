<template>
  <div>
    Confirming Email
  </div>
</template>

<script>

export default {
  name: 'ConfirmEmail',

  components: {
  },
  data() {
    return {
      foo: 'bar',
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location);
    console.log(urlParams.has('token')); // true
    console.log(urlParams.get('token')); // "MyParam"
  },
  created() {
  },
};
</script>
