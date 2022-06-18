<template>
  <div class="layout-auth flex aic jcc">
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'Auth',
  middleware: 'guest'
}
</script>

<style lang="scss" scoped>
.layout-auth {
  min-height: 100vh;
}
</style>
