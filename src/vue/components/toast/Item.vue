<template>
  <div class="toast-item">
    <div class="toast-item__icon">
      <div class="toast-item__icon-bg">
        <svg class="ic-18" :class="'ic-' + item.class">
          <use v-if="item.class === 'green'" xlink:href="~/static/img/icons.svg#check_circle" />
          <use v-if="item.class === 'yellow'" xlink:href="~/static/img/icons.svg#alert" />
          <use v-if="item.class === 'red'" xlink:href="~/static/img/icons.svg#alert_triangle" />
        </svg>
      </div>
    </div>
    <div class="toast-item__body">
      <button class="toast-item__close" @click.stop="$emit('close')">
        <svg class="ic-14 ic-black">
          <use xlink:href="~/static/img/icons.svg#close" />
        </svg>
      </button>
      <h4>{{ $t(item.title) }}</h4>
      <p>{{ $t(item.message) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastItem',

  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-item {
  background-color: #FFF;
  border: 1px #DDD solid;
  box-shadow: 0 10px 30px -2px rgba(0, 0, 0, .1);
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  border-radius: $br;
  width: 300px;
  overflow: hidden;
  position: relative;

  $self: &;

  &.green {
    background-color: $green-extra-light;
    color: $green;
    border-color: $green;

    // #{$self}__icon-bg {
    //   background-color: $green;
    // }
  }
  &.yellow {
    background-color: $yellow-extra-light;
    color: $yellow-dark;
    border-color: $yellow;

    // #{$self}__icon-bg {
    //   background-color: $yellow;
    // }
  }
  &.red {
    background-color: $red-extra-light;
    color: $red;
    border-color: $red;

    // #{$self}__icon-bg {
    //   background-color: $red;
    // }
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 20px;
    height: 20px;
    border: 0;
    background-color: transparent;
    opacity: .5;
    border-radius: $br;
    transform: scale(1);
    transition: .3s;

    &:hover {
      background-color: rgba(0, 0, 0, .1);
      opacity: 1;
    }
    &:active {
      transform: scale(0.9);
      transition: .3s;
    }
  }

  &__icon {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 0;

    &-bg {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 100px;
    }
  }

  &__body {
    padding: 10px 15px 10px 5px;

    & > h4 {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px;
    }
    & > p {
      font-size: 12px;
      font-weight: normal;
      margin: 0;
      line-height: 18px;
    }
  }
}
</style>
