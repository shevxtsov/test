<template>
  <div class="layout-default" @click="reSendToken">
    <!-- Toast -->
    <ToastBase class="top-right" />

    <!-- Header -->
    <BaseHead />

    <!-- Content -->
    <main class="main">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Default',
  middleware: ['auth', 'roles'],

  mounted () {
    Promise.all([
      this.getClientIP(),
      this.getCommunicationObjects(),
      this.getTrafficKinds(),
      this.getOrganizations(),
      this.getRoles()
    ])
  },

  methods: {
    ...mapActions({
      getTrafficKinds: 'helpers/getTrafficKinds',
      getOrganizations: 'helpers/getOrganizations',
      getRoles: 'helpers/getRoles',
      getCommunicationObjects: 'helpers/getCommunicationObjects',
      getClientIP: 'getClientIP'
    }),
    reSendToken () {
      this.$bus.$emit('restart')
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-default {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}
.code {
  font-size: 12px;
  color: rgba(0,0,0,0.5);
}
</style>
