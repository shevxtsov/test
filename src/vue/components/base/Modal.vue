<template>
  <div class="modal">
    <div v-click-outside="() => { isOpenModal = false }" class="modal__content">
      <button
        class="modal__close flex aic jcc"
        @click="isOpenModal = false"
      >
        <svg class="ic-16 ic-white">
          <use xlink:href="@/static/img/icons.svg#close" />
        </svg>
      </button>
      <div v-if="has.head" class="modal__content-head">
        <slot name="head" />
      </div>
      <div class="modal__content-body">
        <slot name="body">
          Some modal content
        </slot>
      </div>
      <div class="modal__content-foot grid gtc2 aic">
        <slot name="foot">
          <button class="modal__btn cancel" @click="$emit('cancel')">
            Отмена
          </button>
          <button class="modal__btn success" @click="$emit('success')">
            Подтвердить
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },
    has: {
      type: Object,
      default: () => {
        return {
          head: false,
          body: true,
          foot: true
        }
      }
    }
  },

  computed: {
    isOpenModal: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.8);

  &__content {
    background-color: #FFF;
    border-radius: $br;
    position: relative;
    width: 100%;

    .sm > & {
      max-width: 350px;
    }

    &-foot {
      border-radius: 0 0 $br $br;
      overflow: hidden;
    }
  }

  &__btn {
    border: 0;
    background-color: #FFF;
    padding: 0;
    height: 40px;
    cursor: pointer;
    border-top: $b1;

    &.cancel {
      // background-color: $red-extra-light;
      color: $red;

      &:hover {
        background-color: $red;
        color: #FFF;
      }
      &:active {
        background-color: $red-dark;
        color: #FFF;
      }
    }

    &.success {
      // background-color: $green-extra-light;
      color: $green-dark;
      border-left: $b1;

      &:hover {
        background-color: $green;
        color: #FFF;
      }
      &:active {
        background-color: $green-dark;
        color: #FFF;
      }
    }
  }

  &__close {
    position: absolute;
    right: 0;
    top: -40px;
    width: 30px;
    cursor: pointer;
    height: 30px;
    border-radius: $br;
    border: 0;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
