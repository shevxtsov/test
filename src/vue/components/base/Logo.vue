<template>
  <div class="base-logo">
    <img v-if="big" src="@/static/img/new-logo-enter.svg" alt="Sunkar - Трафик">
    <img v-else src="@/static/img/logo-login.svg" alt="Sunkar - Трафик">
  </div>
</template>

<script>
export default {
  name: 'BaseLogo',

  props: {
    big: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
img{
  width:200px;
  height:70px;
}
.base-logo {
  &__big {
    b {
      display: block;
      padding: 2px 6px;
      border-radius: $br;
      background-color: $primary;
      color: #FFF;
    }
  }
}
</style>
