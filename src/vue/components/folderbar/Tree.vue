<template>
  <ul class="tree">
    <FolderbarTreeItem
      v-for="item of list"
      :key="item.id"
      v-model="selected"
      :item="item"
      :color="color"
    />
  </ul>
</template>

<script>
export default {
  name: 'FolderbarTree',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: ''
    }
  },

  computed: {
    selected: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-gap: 5px;
  background-image: url('~/static/img/folder-vline.svg');
  background-position: left top;
  background-repeat: repeat-y;
  position: relative;
}
</style>
