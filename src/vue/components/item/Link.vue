<template>
  <NuxtLink
    :to="item.link"
    class="link flex aic"
    :exact="item.link === '/'"
    :class="(role === 'ROLE_ADMIN' && item.min) + ' ' + (!item.toolbar && 'no-toolbar')"
  >
    {{ item.name }}
  </NuxtLink>
</template>

<script>
export default {
  name: 'Link',

  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  computed: {
    role () {
      return this.$store?.getters?.auth?.roles[0]?.name || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  padding: 0 10px;
  text-decoration: none;
  height: 100%;
  color: #000;
  opacity: .7;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background-color: $grey-light;
    color: #000;
  }

  &.min {
    @media screen and (max-width: 1990px){
      &-1900 {
        display: none;
      }
    }
    @media screen and (max-width: 1700px){
      &-1700 {
        display: none;
      }
    }
    @media screen and (max-width: 1660px){
      &-1600 {
        display: none;
      }
    }
    @media screen and (max-width: 1400px){
      &-1400 {
        display: none;
      }
    }
    @media screen and (max-width: 1270px){
      &-1230 {
        display: none;
      }
    }
  }

  &.nuxt-link-active {
    opacity: 1;
    background-color: $grey;
    color: $primary;
    box-shadow: 1px 0 0 0 #DDD, -1px 0 0 0 #DDD, 0 2px 0 0 #EEE;
  }
  &.no-toolbar.nuxt-link-active {
    box-shadow: 1px 0 0 0 #DDD, -1px 0 0 0 #DDD;
  }
}
</style>
