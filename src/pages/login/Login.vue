<template>
  <form @submit.prevent="fazerLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">Expenses</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <input required v-model="email" type="email" class="form-control" placeholder="E-mail" />
        </div>
        <div class="form-group">
          <input required v-model="senha" type="password" class="form-control" placeholder="Senha" />
        </div>
        <button class="btn btn-primary w-100" :disabled="loading">
          <template v-if="loading">
            <i class="fa fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Entrar
            <i class="fa fa-sign-in-alt"></i>
          </template>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      loading: false,
      email: "jonatasbermudes@gmail.com",
      senha: "123123"
    };
  },

  methods: {
    async fazerLogin() {
      this.loading = true;

      const { email, senha } = this;

      try {
        const response = await this.$firebase
          .auth()
          .signInWithEmailAndPassword(email, senha);
        window.uid = response.user.id;
        console.log("tentativa login");
        console.log(window.uid);
        this.$router.push({ name: "home" });
      } catch (err) {
        let message = "";

        switch (err.code) {
          case "auth/user-not-found":
            message = "Não foi possível localizar o usuário!";
            break;
          case "auth/wrong-password":
            message = "Senha inválida!";
            break;
          default:
            message = "Não foi possível realizar o login! Tente novamente.";
            break;
        }

        this.$root.$emit("Notification::show", {
          type: "danger",
          message
        });
      }

      this.loading = false;
    }
  },

  beforeRouteEnter(to, from, next) {
    // 'vm' recebe uma instancia do 'this'
    next(vm => {
      if (window.uid) {
        vm.$router.push({ name: "home" });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.form-login {
  //Centraliza o conteúdo
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 18pt;
  }

  .card {
    width: 30%;
    color: var(--darker);
  }
}
</style>
