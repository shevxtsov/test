<template>
  <div class="toast-base">
    <ToastItem
      v-for="(item, index) of rows"
      :key="'toast-' + index"
      :class="item.class"
      :item="item"
      @close="removeItem(index)"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  name: 'ToastBase',

  props: {
    max: {
      type: Number,
      default: 5
    }
  },

  data: () => ({
    rows: []
  }),

  watch: {
    rows: debounce(function () {
      this.clearList()
    }, 3000)
  },

  mounted () {
    this.$bus.$on('setToast', (data) => {
      if (this.rows?.length > this.max) {
        this.rows.pop()
        this.rows.unshift(data)
      } else {
        this.rows.unshift(data)
      }
    })
  },

  methods: {
    clearList () {
      this.rows.pop()
    },
    removeItem (index) {
      this.rows.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-base {
  position: fixed;
  z-index: 99999;
  display: grid;
  grid-gap: 10px;
  padding: 0;

  &.top-right {
    top: 60px;
    right: 30px;
  }
  &.bottom-right {
    bottom: 30px;
    right: 30px;
  }
}
</style>
