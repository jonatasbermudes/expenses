<template>
  <div v-if="show" :class="`alert-${type}`" class="alert alert-dismissible fade show">
    {{ message }}
    <button @click="close()" type="button" class="close">
      <span>&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      type: "danger",
      message: ""
    };
  },

  created() {
    this.$root.$on("Notification::show", payload => {
      this.show = true;
      this.type = payload.type;
      this.message = payload.message;

      setTimeout(() => {
        this.close();
      }, payload.timeout || 4000);
    });
  },

  methods: {
    close() {
      this.message = "";
      this.type = "danger";
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.alert {
  right: 20px;
  top: 20px;
  position: absolute;
  z-index: 100;
  max-width: 400px;
}
</style>