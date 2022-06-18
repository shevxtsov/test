<template>
  <div class="load flex aic jcc">
    <img src="@/static/img/loading.svg" class="load__img">
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.load {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;

  &.min {
    position: relative;

    & > img {
      width: 24px;
      height: 24px;
    }
  }

  &.white {
    background-color: #FFF;
  }
  &.white-transparent {
    background-color: #FFF;
    opacity: 0.8;
  }

  &__img {
    width: 50px;
    height: 50px;
  }
}
</style>
