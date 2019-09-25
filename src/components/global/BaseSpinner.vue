<template>
  <div class="base-spinner fa-3x" v-if="visible">
    <i class="fas fa-circle-notch fa-spin"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    }
  },

  created () {
    this.$root.$on('Spinner::show', () => { this.visible = true })
    this.$root.$on('Spinner::hide', () => { this.visible = false })
  }
}
</script>

<style lang="scss" scoped>
.base-spinner {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;

  //Sobrepoe o componente sobre as outros
  z-index: 1000;

  //Utiliza toda largura e altura da tela
  width: 100vw;
  height: 100vh;

  //Centraliza o conteúdo na tela
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--dark-medium);
  color: var(--featured);
}
</style>
