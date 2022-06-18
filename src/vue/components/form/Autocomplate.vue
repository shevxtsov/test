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
    <div v-click-outside="() => { isOpen = false }" class="autocomplete ddown ddown-left">
      <div class="autocomplete__input">
        <input
          id="autocomplete"
          v-model.trim="searchText"
          type="text"
          name="autocomplete"
          :placeholder="placeholder"
          autocomplete="off"
          :required="required"
          :disabled="disabled"
          @input="inputHandler"
          @focus="isOpen = true"
        >
        <button v-if="searchText" class="autocomplete__clear flex aic jcc" @click="clearItem">
          <svg class="ic-14 ic-black">
            <use xlink:href="~/static/img/icons.svg#close" />
          </svg>
        </button>
      </div>

      <div v-if="isOpen" class="autocomplete__list ddown__body pt1 pb1">
        <template v-if="searchedList && searchedList.length">
          <button
            v-for="item of searchedList"
            :key="item[itemValue]"
            :title="item[itemText]"
            class="autocomplete__item flex aic ggap1"
            @click="selectItem(item)"
          >
            <span class="cut">{{ item[itemText] }}</span>
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
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    value: {
      type: Number,
      default: 0
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    isOpen: false,
    searchText: '',
    searchedList: []
  }),

  computed: {
    modelValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },

  watch: {
    items: {
      handler () {
        if (this.items) {
          this.searchText = this.value
            ? this.items?.find(item => item[this.itemValue] === this.value)?.[this.itemText]
            : undefined

          this.updateSearchList()
        }
      }
    },
    value: {
      immediate: true,
      handler (val) {
        if (this.items) {
          this.searchText = val
            ? this.items?.find(item => item[this.itemValue] === val)?.[this.itemText]
            : undefined

          this.updateSearchList()
        }
      }
    }
  },

  methods: {
    inputHandler () {
      this.updateSearchList()

      if (!this.searchText) {
        this.modelValue = 0
      }
    },

    updateSearchList () {
      this.searchedList = this.searchText
        ? this.items.filter(item => item[this.itemText]?.toLowerCase()?.includes(this.searchText?.toLowerCase()))
        : [...this.items]
    },

    selectItem (item) {
      this.modelValue = item[this.itemValue] ?? 0
      this.isOpen = false
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
.autocomplete {
  z-index: 999;

  &__list {
    min-width: 100%;
    max-width: calc(100vh - 100px);
  }

  &__item {
    border: 0;
    width: 100%;
    text-align: left;
    background-color: transparent;
    padding: 6px 15px;

    &:hover {
      background-color: $grey-light;
    }

    &:active {
      background-color: $grey;
    }
  }

  &__input {
    position: relative;
  }

  &__clear {
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    background-color: #FFF;
    border: 0;
    border-radius: 0 4px 4px 0;

    & > svg {
      opacity: .5;
    }

    &:hover {
      & > svg {
        opacity: 1;
      }
    }
  }
}
</style>
