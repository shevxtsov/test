<template>
  <div class="alert">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Alert',

  props: {
    text: {
      type: String,
      default: 'No message'
    },
    state: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  border-left: 4px $grey-dark solid;
  background-color: $grey-light;
  padding: 10px 15px;
  border-radius: $br;

  &.yellow {
    border-color: $yellow;
    background-color: $yellow-extra-light;
    color: $yellow-extra-dark;
  }
  &.red {
    border-color: $red;
    background-color: $red-extra-light;
    color: $red-extra-dark;
  }
  &.green {
    border-color: $green;
    background-color: $green-extra-light;
    color: $green-extra-dark;
  }
}
</style>
