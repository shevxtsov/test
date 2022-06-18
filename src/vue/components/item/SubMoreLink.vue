<template>
  <div
    v-click-outside="() => isOpen = false"
    class="more ddown ddown-left"
  >
    <button
      class="ddown__btn flex aic ggap1"
      :class="{ 'active' : isOpen }"
      @click="isOpen = !isOpen"
    >
      <!-- Еще -->
      <svg class="ic-18 ic-black">
        <use xlink:href="@/static/img/icons.svg#hdot" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="ddown__body pt1 pb1"
    >
      <template v-for="item of list">
        <nuxt-link
          v-if="!item.subList"
          :key="item.link"
          :to="item.link"
          class="more__link flex aic"
          :class="item.min"
          :exact="item.link === '/'"
        >
          {{ item.name }}
        </nuxt-link>
        <div
          v-else
          :key="item.link"
          class="more__sublink flex aic ggap1"
          :class="item.min"
        >
          <button
            class="flex aic jcsb ggap1"
            :class="{ 'active' : isOpenSub === item.id }"
            @click="setSubOpen(item.id)"
          >
            {{ item.name }}
            <svg class="ic-14 ic-black">
              <use xlink:href="@/static/img/icons.svg#ddown" />
            </svg>
          </button>

          <div v-if="isOpenSub === item.id" class="more__sublink-list">
            <nuxt-link
              v-for="sub of item.subList"
              :key="sub.link"
              :to="sub.link"
              class="more__link flex aic"
            >
              {{ sub.name }}
            </nuxt-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubMoreLink',

  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data: () => ({
    isOpen: false,
    isOpenSub: -1
  }),

  methods: {
    setSubOpen (id) {
      if (this.isOpenSub === id) { this.isOpenSub = -1 } else { this.isOpenSub = id }
    }
  }
}
</script>

<style lang="scss" scoped>
.more {
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

    &:hover {
      background-color: $grey-light;
    }

    &.nuxt-link-active {
      background-color: $primary;
      color: #FFF;
    }
  }

  &__sublink {
    & > button {
      border: 0;
      background-color: transparent;
      height: 100%;
      width: 100%;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
        background-color: $grey-light;
      }

      &.active {
        background-color: $grey;
      }
    }

    &-list {
      padding: 0 0 0 20px;
      max-width: fit-content;

      & > .more__link {
        display: block;
      }
    }
  }

  &__link,
  &__sublink {
    text-decoration: none;
    color: #000;
    display: none;

    &.min {
      @media screen and (max-width: 1990px){
        &-1900 {
          display: block;
        }
      }
      @media screen and (max-width: 1700px){
        &-1700 {
          display: block;
        }
      }
      @media screen and (max-width: 1660px){
        &-1600 {
          display: block;
        }
      }
      @media screen and (max-width: 1400px){
        &-1400 {
          display: block;
        }
      }
      @media screen and (max-width: 1270px){
        &-1230 {
          display: block;
        }
      }
    }
  }
}
</style>
