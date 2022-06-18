<template>
  <div class="slider">
    <!-- Head -->
    <div class="slider__head grid gtc1auto ggap2" :class="{ 'opened' : isOpenState }">
      <!-- Left -->
      <button
        class="slider__head-btn flex aic ggap1"
        :class="{ 'opened' : isOpenState }"
        @click="isOpenState = !isOpenState"
      >
        <svg class="ic-18 ic-white">
          <use xlink:href="~/static/img/icons.svg#arrow_next" />
        </svg>
        <h1 class="slider__head-title m0">
          {{ title }}
        </h1>
        <img v-if="isLoading" src="~/static/img/loading.svg" class="slider__head-load">
      </button>

      <!-- Right -->
      <span class="slider__head-right">
        <slot name="head" />
      </span>
    </div>

    <!-- Body -->
    <transition name="slide-down">
      <div v-show="isOpenState" class="slider__content grid" :class="{ 'load' : isLoading, 'over' : isOver }">
        <div class="slider__body">
          <slot name="body">
            <div class="p2">
              Body
            </div>
          </slot>
        </div>

        <div v-if="isFoot" class="slider__foot">
          <slot name="foot" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseSlider',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    title: {
      type: String,
      default: 'Title'
    },
    value: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isOver: {
      type: Boolean,
      default: false
    },
    isFoot: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    isOpenState: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  }
}
</script>

<style lang="scss" scoped>
.slider {
  border: $b1;
  border-radius: $br;

  &__head {
    background-color: $grey-light;
    border-radius: $br;

    &.opened {
      border-radius: $br $br 0 0;
    }

    &-right {
      height: 100%;
    }

    &-btn {
      border: 0;
      background-color: transparent;
      padding: 0 15px;
      width: auto;
      height: 40px;
      cursor: pointer;
      text-align: left;

      & > svg {
        background-color: $primary;
        border-radius: 100px;
        transform: rotate(0deg);
        transition: .3s;
      }

      // &:hover {
      //   background-color: $grey;
      // }
      // &:active {
      //   background-color: $grey-dark;
      // }
      &.opened {
        & > svg {
          background-color: transparent;
          fill: $primary;
          transform: rotate(90deg);
          transition: .3s;
        }
      }
    }

    &-title {
      font-size: 16px;
      font-weight: normal;
    }

    &-load {
      width: auto;
      height: 30px;
    }
  }

  &__content {
    &.load {
      position: relative;

      &::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 1px;
        right: 0;
        bottom: 0;
        z-index: 2;
        background-color: rgba(255, 255, 255, .8);
      }
    }
  }

  &__body {
    border-top: $b1;
  }

  .over > &__body {
    overflow: auto hidden;
  }

  &__foot {
    position: inherit;
    z-index: inherit;
    background-color: #fff;
    border-radius: 0 0 $br $br;
    box-shadow: 0 -1px 0 0 #DDD;
  }

  .over > &__foot {
    position: sticky;
    left: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
