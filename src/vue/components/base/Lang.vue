<template>
  <div
    v-click-outside="() => (isOpen = false)"
    class="lang ddown ddown-right"
  >
    <button
      class="lang__btn flex aic ggap1"
      :class="{ active: isOpen }"
      @click="isOpen = !isOpen"
    >
      <img :src="require(`@/static/img/${$i18n.localeProperties.code}.png`)">
      {{ $i18n.localeProperties.name }}
      <svg class="ic-14 ic-black">
        <use xlink:href="~/static/img/icons.svg#ddown" />
      </svg>
    </button>

    <div v-if="isOpen" class="lang__body ddown__body pt1 pb1">
      <button
        v-for="item of $i18n.locales"
        :key="item.code"
        class="lang__item flex aic ggap1"
        :class="{ active: $i18n.localeProperties.code === item.code }"
        @click.prevent="switchLanguage(item.code)"
      >
        <img :src="require(`@/static/img/${item.code}.png`)">
        {{ getLangName(item.code) }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseLang',

  mounted () {
    // Set current language
    if (localStorage.getItem(this.$store.getters.prefix + '_lang')) {
      try {
        const lang = localStorage.getItem(this.$store.getters.prefix + '_lang')
        this.$i18n.setLocale(lang)
      } catch {
        localStorage.removeItem(this.$store.getters.prefix + '_lang')
      }
    }
  },

  methods: {
    switchLanguage (locale) {
      this.$i18n.setLocale(locale)
      localStorage.setItem(this.$store.getters.prefix + '_lang', locale)
    },
    getLangName (code) {
      switch (code) {
        case 'ru':
          return 'Русский'
        case 'kz':
          return 'Қазақша'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lang {
  height: 100%;

  &__btn {
    border: 0;
    background-color: transparent;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;

    & > img {
      width: auto;
      height: 15px;
    }

    &:hover {
      background-color: $grey-light;
    }
    &:active,
    &.active {
      background-color: $grey;
    }
  }

  &__item {
    border: 0;
    padding: 10px 20px;
    background-color: transparent;
    cursor: pointer;
    width: 100%;

    & > img {
      width: auto;
      height: 15px;
    }

    &:hover {
      background-color: $grey-light;
    }

    &.active {
      background-color: $primary-extra-light;
    }
  }
}
</style>
