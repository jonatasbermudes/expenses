<template>
  <div class="w-100 d-flex justify-content-center">
    <button @click="showModal = true" class="btn-novo-gasto btn btn-lg btn-outline-primary w-75">
      <i class="fa fa-plus"></i>
      Novo Gasto
    </button>

    <form @submit.prevent="submit()">
      <div
        class="modal fade"
        :class="{show: showModal}"
        :style="{display: showModal ? 'block' : 'none'}"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLiveLabel">Adicionar um novo gasto</h5>
              <button type="button" @click="closeModal()" class="close" aria-label="Fechar">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for>Descrição</label>
                  <input v-model="form.descricao" type="text" class="form-control" required />
                </div>
                <div class="form-group col-4">
                  <label for>Valor (R$)</label>
                  <input v-model="form.valor" type="text" class="form-control" required />
                </div>
                <div class="form-group col-12 d-flex flex-column align-items-center">
                  <input
                    ref="input"
                    type="file"
                    class="d-none"
                    accept="image/*"
                    @change="handleFile($event)"
                  />

                  <button
                    type="button"
                    @click="openFileDialog()"
                    class="btn w-50 btn-outline-secondary"
                  >Adicionar recibo</button>

                  <div class="mt-2" v-if="form.recibo">
                    {{ form.recibo.name }}
                    <button
                      type="button"
                      @click="form.recibo = ''"
                      class="btn badge badge-light"
                    >
                      <i title="Remover recibo" class="fa fa-trash text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="closeModal()" class="btn btn-secondary">Fechar</button>
              <button class="btn btn-primary" :disabled="loading">
                <template v-if="loading">
                  <i class="fa fa-spinner fa-spin"></i>
                  Incluindo. Aguarde...
                </template>
                <template v-else>
                  Incluir novo gasto
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div
      class="modal-backdrop fade"
      :style="{display: showModal ? 'block' : 'none'}"
      :class="{show: showModal}"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      loading: false,
      form: {
        recibo: "",
        descricao: "",
        valor: ""
      }
    };
  },

  computed: {
    fileName() {
      const { recibo } = this.form;

      if (recibo) {
        const split = recibo.name.split(".");
        return `${split[0]}-${new Date().getTime()}.${split[1]}`;
      } else {
        return "";
      }
    }
  },

  methods: {
    async submit() {
      let url = "";

      try {
        this.$root.$emit("Spinner::show");
        this.loading = true;

        const ref = this.$firebase.database().ref(window.uid);
        const id = ref.push().key;

        if (this.form.recibo) {
          const snapshot = await this.$firebase
            .storage()
            .ref(window.uid)
            .child(this.fileName)
            .put(this.form.recibo);

          url = await snapshot.ref.getDownloadURL();
        }

        const gasto = {
          id,
          ...this.form, // Valores já estão setados nos atributos do "form", então já passsa o objeto inteiro
          recibo: url, // Sobrescreve o objeto do recibo passado acima apenas pela url do arquivo no Storage
          dataCriacao: new Date().getTime()
        };

        ref.child(id).set(gasto, err => {
          if (err) {
            this.$root.$emit("Notification::show", {
              type: "danger",
              message: "Não foi possível inserir o gasto! Tente novamente."
            });
          } else {
            this.$root.$emit("Notification::show", {
              type: "success",
              message: "Gasto inserido com sucesso!"
            });
            this.closeModal();
          }
        });
      } catch (err) {
        this.$root.$emit("Notification::show", {
          type: "danger",
          message: "Não foi possível inserir o gasto! Tente novamente."
        });
      } finally {
        this.$root.$emit("Spinner::hide");
        this.loading = false;
      }
    },

    closeModal() {
      this.showModal = false;
    },

    openFileDialog() {
      this.$refs.input.value = null;
      this.$refs.input.click();
    },

    handleFile({ target }) {
      // "{ target }" acessa um atributo do parâmetro "$event"
      this.form.recibo = target.files[0];
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-novo-gasto {
  font-size: 18px !important;
}
.modal {
  color: var(--dark);
}
</style>