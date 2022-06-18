<template>
  <div class="timer pl15 pr15">
    <small class="tsm">Таймер:</small>
    <b>
      <vac
        ref="vac"
        :left-time="900000"
        @process="setTimer($event.timeObj.m + ':' + $event.timeObj.s)"
        @finish="$emit('logout')"
      >
        <span slot="process">
          {{ timer }}
        </span>
      </vac>
    </b>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'BaseTimer',

  computed: mapGetters(['timer', 'restartTimer']),

  watch: {
    restartTimer: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.commit('setRestartTimerState', false)
        }
        this.$refs?.vac?.startCountdown('restart')
      }
    }
  },

  mounted () {
    this.$bus.$on('restart', async () => {
      await this.setRestartTimerState(true)
      try {
        await this.refreshToken()
      } catch (error) {
        this.$bus.$emit('setToast', {
          title: 'Ошибка',
          message: error.response.data.status + ' - ' + error.response.data.error,
          class: 'red'
        })
      }
    })
  },

  methods: {
    ...mapMutations(['setRestartTimerState', 'setTimer']),
    ...mapActions(['refreshToken'])
  }
}
</script>

<style>

</style>
