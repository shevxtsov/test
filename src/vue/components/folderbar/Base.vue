<template>
  <div class="folderbar" :class="{ 'min' : !isOpen, 'disabled' : isDisabled }">
    <div class="folderbar__head flex aic jcsb">
      <span v-if="isOpen" class="name pl3 pr1 pt1 pb1 flex aic ggap05">
        <span class="cut">{{ $t('Folders') }}</span>
        <button v-if="selectedFolders.length" :disabled="isDisabled" @click="reset">Очистить</button>
      </span>
      <button class="toggler flex aic jcc" @click="isOpen = !isOpen">
        <svg class="ic-16 ic-black">
          <use xlink:href="@/static/img/icons.svg#arrow_first" />
        </svg>
      </button>
    </div>
    <div class="folderbar__body pl2 pr1 pt1 pb1">
      <template v-if="isOpen">
        <keep-alive>
          <BaseLoad v-if="isLoading" />
          <FolderbarTree
            v-else
            v-model="selectedFolders"
            :list="folders"
          />
        </keep-alive>
      </template>
      <div v-else class="folderbar__vertical">
        <span>{{ $t('Folders') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FolderbarBase',

  provide () {
    return {
      multiselect: this.multiselect
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    multiselect: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },

  data: () => ({
    isOpen: true,
    isLoading: false,
    isDisabled: false
  }),

  computed: {
    ...mapGetters({
      folders: 'helpers/folders'
    }),
    selectedFolders: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  },

  watch: {
    selectedItems (val) {
      this.$emit('selectedItems', val)
    },
    isOpen (val) {
      localStorage.setItem(this.$store.getters.prefix + '_folderbar', val)
    }
  },

  async mounted () {
    this.$bus.$on('folderbarDisabled', (val) => {
      this.isDisabled = val
    })
    this.$bus.$on('openFolderbar', () => {
      this.isOpen = true
    })
    if (localStorage.getItem(this.$store.getters.prefix + '_folderbar')) {
      try {
        this.isOpen = JSON.parse(localStorage.getItem(this.$store.getters.prefix + '_folderbar'))
      } catch {
        localStorage.removeItem(this.$store.getters.prefix + '_folderbar')
      }
    }
    this.isLoading = true
    await this.getFolders()
    this.isLoading = false
  },

  methods: {
    ...mapActions({
      getFolders: 'helpers/getFolders'
    }),
    reset () {
      this.selectedFolders = []
    }
  }

}
</script>

<style lang="scss">
.folderbar {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: $grey-light;
  width: 260px;
  height: calc(100vh - 100px);
  overflow: auto;

  &.min {
    width: 30px;

    .toggler > svg {
      transform: rotate(180deg);
    }
  }

  &__head {
    position: sticky;
    top: 0;
    z-index: 1;
    background: $grey-light;
    border-bottom: $b1;
    height: 40px;

    .name {
      color: #777;

      & > button {
        border: $b1;
        border-radius: $br;
        background-color: #FFF;
        padding: 2px 6px;
        cursor: pointer;

        &:hover {
          border-color: $grey-extra-dark;
          color: $primary;
        }
        &:active {
          border-color: $primary;
          color: $primary;
        }
      }
    }

    .toggler {
      border: 0;
      background: transparent;
      height: 100%;
      width: 30px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background-color: $grey;
      }
    }
  }

  &.disabled > &__body {
    pointer-events: none;

    & > .tree {
      filter: grayscale(1);
    }
  }

  &__vertical {
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    height: calc(100% - 40px);
    overflow: hidden;

    & > span {
      transform: rotate(-90deg);
      position: absolute;
      left: -135px;
      top: 141px;
      width: 300px;
      text-align: right;
      padding: 0 15px;
      opacity: .5;
    }
  }
}
</style>
