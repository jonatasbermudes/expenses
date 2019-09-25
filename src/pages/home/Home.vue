<template>
  <div class="home">
    <div class="row">
      <div class="col-6 home-box">
        <small>Você gastou</small>
        <div class="money" v-money-format="totais.totalGasto" />
        <small>em {{ totais.qtdGastos }} compras</small>
      </div>
      <div class="col-6 home-box">
        <small>A média de gastos é de</small>
        <div class="money" v-money-format="totais.media" />
      </div>
      <div class="col-6 home-box">
        <small>A maior gasto foi de</small>
        <div class="money" v-money-format="totais.maiorGasto.valor" />
        <small v-date-format="totais.maiorGasto.dataCriacao" />
      </div>
      <div class="col-6 home-box">
        <small>O menor gasto foi de</small>
        <div class="money" v-money-format="totais.menorGasto.valor" />
        <small v-date-format="totais.menorGasto.dataCriacao" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      expenses: []
    };
  },

  created() {
    this.getData();
  },

  computed: {
    totais() {
      const { expenses: exp } = this;
      const values = {
        totalGasto: 0,
        media: 0,
        maiorGasto: {},
        menorGasto: {},
        qtdGastos: 0
      };

      if (exp.length) {
        values.totalGasto = exp
          .map(e => +e.valor)
          .reduce((acc, cur) => acc + cur, 0);
        values.media = values.totalGasto / exp.length;
        values.maiorGasto = exp.sort((a, b) => +b.valor - +a.valor)[0];
        values.menorGasto = exp.sort((a, b) => +a.valor - +b.valor)[0];
        values.qtdGastos = exp.length
      }

      return values;
    }
  },

  methods: {
    getData() {
      const ref = this.$firebase.database().ref(window.uid);

      ref.on("value", data => {
        const values = data.val();
        this.expenses = Object.keys(values).map(i => values[i]);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 15px;
  .home-box {
    width: 100%;
    height: calc(50vh - 15px);
    display: flex;
    font-size: 30pt;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--dark-medium);
    small {
      font-size: 1.3rem;
    }
    .money {
      color: var(--featured);
    }
    &:nth-child(2),
    &:nth-child(4) {
      border-left: none;
    }
    &:nth-child(3),
    &:nth-child(4) {
      border-top: none;
    }
  }
}
</style>
