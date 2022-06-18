<template>
  <div
    v-click-outside="() => isOpen = false"
    class="sublink ddown ddown-left"
    :class="role === 'ROLE_ADMIN' && item.min"
  >
    <button
      class="ddown__btn flex aic ggap1"
      :class="{ 'active' : isOpen }"
      @click="isOpen = !isOpen"
    >
      {{ item.name }}
      <svg class="ic-14 ic-black">
        <use xlink:href="@/static/img/icons.svg#ddown" />
      </svg>
    </button>

    <div v-if="isOpen" class="ddown__body pt1 pb1">
      <NuxtLink
        v-for="sub of item.subList"
        :key="sub.link"
        :to="sub.link"
        class="sublink__link flex aic"
      >
        {{ sub.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubLink',

  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data: () => ({
    isOpen: false
  }),

  computed: {
    role () {
      return this.$store?.getters?.auth?.roles[0]?.name || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sublink {
  height: 100%;

  & > button {
    border: 0;
    background-color: transparent;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    opacity: .7;

    &:hover {
      opacity: 1;
      background-color: $grey-light;
      color: #000;
    }

    &.active {
      opacity: 1;
      background-color: $grey;
    }
  }

  &__link {
    padding: 10px 20px;
    text-decoration: none;
    color: #000;

    &:hover {
      background-color: $grey-light;
    }

    &.nuxt-link-active {
      background-color: $primary;
      color: #FFF;
    }
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
}
</style>
