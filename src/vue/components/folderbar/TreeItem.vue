<template>
  <li class="tree__node" :class="color">
    <div class="grid">
      <button
        class="tree__arrow"
        :class="{ 'opened' : isOpen }"
        @click="isOpen = !isOpen"
      >
        <svg
          v-if="item.subFolder && item.subFolder.length"
          class="ic-16 ic-black"
        >
          <use xlink:href="~/static/img/icons.svg#ddown" />
        </svg>
      </button>
      <button
        class="tree__folder grid gtcauto1 aic"
        :class="{ 'active' : isSelected }"
        :title="item.name"
        @click="selectToggler"
        @dblclick="isOpen = !isOpen"
      >
        <svg class="ic-18 ic-primary">
          <use
            v-if="isOpen && item.subFolder && item.subFolder.length"
            xlink:href="~/static/img/icons.svg#folder_open"
          />
          <use
            v-else
            xlink:href="~/static/img/icons.svg#folder"
          />
        </svg>
        <span class="cut">{{ item.name }}</span>
      </button>
    </div>

    <template v-if="item.subFolder && item.subFolder.length">
      <ul v-if="isOpen" class="tree">
        <FolderbarTreeItem
          v-for="sub of item.subFolder"
          :key="sub.id"
          v-model="arr"
          :color="color"
          :item="sub"
        />
      </ul>
    </template>
  </li>
</template>

<script>
export default {
  name: 'FolderbarTreeItem',

  inject: ['multiselect'],

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    color: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    isOpen: false
  }),

  computed: {
    arr: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    },
    isSelected () {
      const index = this.arr.findIndex(item => item.id === this.item.id)
      return index !== -1
    }
  },

  methods: {
    selectToggler () {
      const index = this.arr.findIndex(item => item.id === this.item.id)
      if (index === -1) {
        if (!this.multiselect) {
          this.arr = [this.item]
        } else {
          this.arr.push(this.item)
        }
      } else {
        this.arr.splice(index, 1)
      }
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

  &__node {
    position: relative;
    padding: 0 0 0 30px;
    display: grid;
    grid-gap: 5px;

    &:last-child {
      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        height: calc(100% - 15px);
        width: 28px;
        background-color: $grey-light;
        z-index: 1;
      }
    }

    &.white {
      &:last-child {
        &::after {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          height: calc(100% - 15px);
          width: 28px;
          background-color: #FFF;
          z-index: 1;
        }
      }
    }
  }

  &__arrow {
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 4px;
    background-color: transparent;
    background-image: url('~/static/img/folder-hline.svg');
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    & > svg {
      position: relative;
      z-index: 2;
      transform: rotate(-90deg);
    }

    &.opened {
      & > svg {
        transform: rotate(0deg);
      }
    }
  }

  &__folder {
    background-color: transparent;
    text-align: left;
    grid-gap: 10px;
    padding: 0 8px;
    margin: 0;
    border: 0;
    border-radius: 4px;
    height: 30px;
    cursor: pointer;

    &:hover {
      background-color: #FFF;
      box-shadow: inset 0 0 0 1px $bcolor;
    }
    &.active {
      background-color: #FFF;
      box-shadow: inset 0 0 0 1px $primary;
    }
  }
}
</style>
