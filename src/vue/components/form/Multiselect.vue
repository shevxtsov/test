<template>
  <div
    class="form-item"
    :class="{
      'error' : error,
      'required' : required,
      'disabled' : disabled
    }"
  >
    <label class="mb05">{{ $t(label) }}</label>
    <div v-click-outside="() => { isOpen = false }" class="multiselect ddown ddown-left">
      <!-- Input -->
      <div
        class="multiselect__input"
        :class="{ 'focus' : isOpen }"
        @click="isOpen = !isOpen"
      >
        <select
          v-model="modelValue"
          multiple
          :name="name"
          :required="required"
          :disabled="disabled"
        >
          <option
            v-for="(item, index) of items"
            :key="name + '-' + index"
            :value="item"
          >
            {{ translate ? $t(item[itemKey]) : item[itemKey] }}
          </option>
        </select>

        <!-- Placeholder -->
        <span
          v-if="!modelValue.length"
          class="multiselect__placeholder"
        >
          {{ $t(placeholder) }}
        </span>

        <!-- Tags -->
        <template v-else>
          <span
            v-for="(item, index) of modelValue"
            :key="name + '-' + index"
            class="multiselect__tag"
          >
            {{ translate ? $t(item[itemKey]) : item[itemKey] }}
          </span>
        </template>
      </div>

      <!-- Ddown -->
      <div
        v-if="isOpen"
        class="multiselect__list ddown__body pt1 pb1"
      >
        <template v-if="items && items.length">
          <button
            v-for="item of items"
            :key="item[itemVal]"
            type="button"
            class="multiselect__list-item flex aic ggap1"
            :class="{ 'active' : isSelected(item.id) }"
            @click.prevent="selectItem(item)"
          >
            {{ item[itemKey] }}
          </button>
        </template>
        <div v-else class="pl1 pr1">
          {{ $t('AlertNothingFound') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormAutocomplate',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      default: 'label',
      required: true
    },
    name: {
      type: String,
      default: 'name',
      required: true
    },
    value: {
      type: Array,
      default: () => [],
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    translate: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      default: 'key'
    },
    itemVal: {
      type: String,
      default: 'val'
    },
    error: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isPlaceholder: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Select'
    },
    autocomplete: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    isOpen: false,
    searchText: '',
    searchedList: [],
    modelValue: []
  }),

  // computed: {
  //   modelValue: {
  //     get () {
  //       return this.items.filter(item => this.value.find(el => el.id === item.id))
  //     },
  //     set (val) {
  //       console.log(val)
  //       this.$emit('change', val)
  //     }
  //   }
  // },

  watch: {
    value: {
      handler (val) {
        this.modelValue = this.items.filter(item => val.find(el => el.id === item.id))
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    isSelected (id) {
      return this.modelValue.findIndex(el => el.id === id) !== -1
    },
    selectItem (item) {
      const index = this.modelValue.findIndex(el => el.id === item.id)
      if (index === -1) {
        this.modelValue.push(item)
      } else {
        this.modelValue.splice(index, 1)
      }
      this.$emit('change', this.modelValue)
      this.$forceUpdate()
    },
    clearItem () {
      this.searchText = ''
      this.modelValue = 0
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>

.multiselect {
  $self: &;

  &__input {
    background-color: #FFF;
    border: $b1;
    border-radius: $br;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEzTDE1LjMzMzMgMTYuMzMzM0wxOC42NjY3IDEzSDEyWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC41NCIvPgo8L3N2Zz4K");
    background-position: center right;
    background-repeat: no-repeat;
    padding: 4px 25px 4px 5px;
    position: relative;
    min-height: 30px;
    display: flex;
    flex-wrap: wrap;
    grid-gap: 5px;

    & > select {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      pointer-events: none;
      opacity: 0;

    }

    &:hover {
      border-color: #999;
    }
    &.focus {
      border-color: #555;
    }
  }

  &__placeholder {
    padding: 2px 6px;
  }

  &__tag {
    padding: 2px 6px;
    background-color: $grey;
    color: #000;
    display: inline-flex;
    border-radius: $br;
  }

  &__list {
    display: grid;
    width: 100%;
    max-height: calc(100vh - 350px);
    overflow-y: auto;

    &-item {
      border: 0;
      background-color: #FFF;

      padding: 10px 15px;
      text-align: left;
      width: 100%;
      border-bottom: 1px #EEE solid;

      &:last-child {
        border: 0;
      }

      &:hover {
        background-color: $grey;
      }
      &.active {
        background-color: $primary-extra-light;
        color: $primary;
      }
    }
  }
}

.disabled {
  pointer-events: none;

  .multiselect__input {
    background-color: $grey;
  }

  .multiselect__tag {
    // background-color: #FFF;

  }
}
</style>
