import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      meta: {
        icon: 'home', title: 'Home'
      },
      component: () => import(/* webpackChunkName: "home" */ './pages/home/Home')
    },
    {
      name: 'lista-gastos',
      path: '/lista-gastos',
      meta: {
        icon: 'list-ul', title: 'Lista de Gastos'
      },
      component: () => import(/* webpackChunkName: "lista-gastos" */ './pages/lista-gastos/ListaGastos')
    },
    {
      name: 'login',
      path: '/login',
      meta: {
        title: 'Login'
      },
      component: () => import(/* webpackChunkName: "login" */ './pages/login/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Expenses`

  console.log(window.uid)

  if (!window.uid && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
