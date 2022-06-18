<template>
  <div
    class="form-item"
    :class="{
      'error': !valid,
      'required' : required,
      'disabled' : disabled
    }"
  >
    <label class="mb05">{{ $t('Folders') }}</label>
    <div class="foldertags flex fw ggap1" @click="$bus.$emit('openFolderbar')">
      <input
        type="checkbox"
        name="has-folder"
        :checked="tags.length"
        :required="required"
      >

      <span
        v-if="!tags.length"
        class="foldertags__placeholder flex aic"
      >
        {{ placeholder }}
      </span>

      <template v-else>
        <span v-for="tag of tags" :key="tag._uid" class="foldertags__item grid aic gtc1auto">
          <span class="pl05 pr05 cut">
            {{ tag.name }}
          </span>
          <button
            type="button"
            class="flex aic jcc"
            :disabled="readonly"
            @click="$emit('removeFolder', tag.id)"
          >
            <svg class="ic-14 ic-black">
              <use xlink:href="@/static/img/icons.svg#close" />
            </svg>
          </button>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFolders',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    placeholder: {
      type: String,
      default: 'Выберите папку'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      valid: true
    }
  },

  computed: {
    tags: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },

  watch: {
    value (val) {
      if (val.length) {
        this.validate()
      }
    }
  },

  methods: {
    validate () {
      if (!this.value.length) {
        this.valid = false
      } else {
        this.valid = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  label {
    font-size: 12px;
    color: #777;
    display: flex;
    align-items: center;
    grid-gap: 2px;
  }

  &.disabled > .foldertags {
    pointer-events: none;
    background-color: $grey;
  }

  &.required {
    label {
      &::after {
        content: "*";
        display: block;
        color: $red;
      }
    }
  }
}
.foldertags {
  border: $b1;
  border-radius: $br;
  padding: 5px;
  background-color: #FFF;
  min-height: 30px;

  &:hover {
    border-color: #999;
  }

  & > input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  &__placeholder {
    color: #CCC;
    padding: 0 5px;
  }

  &__item {
    height: 18px;
    background-color: $grey-light;
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0 0 0 1px #DDD;

    button {
      border: 0;
      border-left: $b1;
      padding: 0;
      border-radius: 0;
      background-color: #FFF;
      width: 20px;
      height: 100%;
      cursor: pointer;

      &:hover {
        background-color: $grey-light;

        & > svg {
          fill: $red;
        }
      }
      &:active {
        background-color: $grey;

        & > svg {
          fill: $red;
        }
      }
    }
  }
}

</style>
