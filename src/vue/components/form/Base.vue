<template>
  <form class="form-base" @submit.prevent="$emit('sendAction')">
    <!-- Body -->
    <div
      class="form-base__body grid gtcauto ggap2 p2"
      :class="bodyClass"
    >
      <slot name="body" />
    </div>

    <!-- Foot -->
    <div
      v-if="hasFoot"
      class="form-base__foot flex aic ggap2 pl2 pr2 pt15 pb15"
      :class="footClass"
    >
      <slot name="foot">
        <button
          v-if="hasCancel"
          type="button"
          class="btn btn-base"
          :disabled="isReset"
          @click="$emit('resetAction')"
        >
          {{ $t(cancelBtn) }}
        </button>
        <button
          type="submit"
          class="btn btn-primary"
        >
          {{ $t(sendBtn) }}
        </button>
      </slot>
    </div>
  </form>
</template>

<script>
export default {
  name: 'FormBase',

  props: {
    bodyClass: {
      type: String,
      default: ''
    },
    footClass: {
      type: String,
      default: ''
    },
    hasFoot: {
      type: Boolean,
      default: true
    },
    isReset: {
      type: Boolean,
      default: false
    },
    hasCancel: {
      type: Boolean,
      default: true
    },
    cancelBtn: {
      type: String,
      default: 'Cancel'
    },
    sendBtn: {
      type: String,
      default: 'Send'
    }
  }
}
</script>

<style lang="scss" scoped>
.form-base {
  background-color: #FFF;
  border-radius: $br;
  min-width: 300px;

  &.has-body {
    background-color: $grey-extra-light;
    border: $b1;
  }
  &.min {
    width: 300px;
  }

  &__foot {
    border-top: $b1;
  }
}
</style>
