import Vue from 'vue'
import vueAwesomeCountdown from 'vue-awesome-countdown'
import shareMutations from 'vuex-shared-mutations'

Vue.use(vueAwesomeCountdown, 'vac')

export default ({ store }) => {
  window.onNuxtReady(() => {
    shareMutations({
      predicate: ['setTimer', 'setRestartTimerState']
    })(store)
  })
}
