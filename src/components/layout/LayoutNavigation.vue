<template>
  <nav class="nav flex-column justify-content-between">
    <div>
      <router-link
        exact
        :key="i"
        class="nav-link"
        exact-active-class="active"
        :to="{ name: router.name }"
        v-for="(router, i) in routerLinks"
      >
        <i class="fa menu-icon" :class="`fa-${router.meta.icon}`"></i>
        {{ router.meta.title }}
      </router-link>

      <hr>

        <layout-new-expense />
    </div>

    <layout-logout />
  </nav>
</template>

<script>
import LayoutLogout from "./LayoutLogout";
import LayoutNewExpense from "./LayoutNewExpense";

export default {
  components: {
    LayoutLogout,
    LayoutNewExpense
  },
  computed: {
    routerLinks() {
      return this.$router.options.routes.filter(r => r.name !== "login");
    }
  }
};
</script>

<style lang="scss" scoped>
.nav {
  margin-left: -15px;
  width: calc(100% + 30px);
  height: calc(100vh - 50px);
  .nav-link {
    color: var(--white);
    transition: 0.2s;
    &.active {
      color: var(--featured);
      background-color: transparent;
    }
    &:hover {
      color: var(--dark);
      background-color: var(--featured);
    }
    .menu-icon {
      margin-right: 10px;
    }
  }
}
</style>