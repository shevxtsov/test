<template>
  <div
    class="form-item"
    :class="{
      'error' : error || inValid,
      'required' : required
    }"
    :data-name="name"
  >
    <label class="mb05">{{ $t(label) }}</label>

    <!-- Password input -->
    <div
      v-if="type === 'password'"
      class="form-item__password grid aic gtc1auto"
    >
      <input
        v-model="modelValue"
        :type="isPassword ? 'password' : 'text'"
        :required="required"
        :disabled="disabled"
        :name="name"
        :placeholder="isPassword ? '*********' : $t(placeholder)"
        :autocomplete="autocomplete"
      >
      <button type="button" @click="isPassword = !isPassword">
        <svg class="ic-14 ic-black">
          <use v-if="isPassword" xlink:href="~/static/img/icons.svg#eye-off" />
          <use v-else xlink:href="~/static/img/icons.svg#eye" />
        </svg>
      </button>
    </div>

    <!-- Masked -->
    <div
      v-else-if="type === 'mask'"
      class="form-item__ip flex aic"
      :class="{ 'active' : focused }"
    >
      <TheMask
        v-model.number="ip.one"
        placeholder="255"
        mask="###"
        :required="required"
        @focus="focused = true"
        @blur="blurHandler('one')"
        @input="inputHandler($event, 'one')"
      />
      <span>.</span>
      <TheMask
        v-model.number="ip.two"
        placeholder="255"
        mask="###"
        :required="required"
        @focus="focused = true"
        @blur="blurHandler('two')"
        @input="inputHandler($event, 'two')"
      />
      <span>.</span>
      <TheMask
        v-model.number="ip.three"
        placeholder="255"
        mask="###"
        :required="required"
        @focus="focused = true"
        @blur="blurHandler('three')"
        @input="inputHandler($event, 'three')"
      />
      <span>.</span>
      <TheMask
        v-model.number="ip.four"
        placeholder="255"
        mask="###"
        :required="required"
        @focus="focused = true"
        @blur="blurHandler('four')"
        @input="inputHandler($event, 'four')"
      />
    </div>

    <!-- Select -->

    <select
      v-else-if="type === 'select'"
      v-model="modelValue"
      :name="name"
      :required="required"
      :disabled="disabled"
    >
      <option v-if="isPlaceholder" value="">
        {{ $t(placeholder) }}
      </option>
      <option
        v-for="(item, index) of items"
        :key="name + '-' + index"
        :value="item[itemVal]"

        :disabled="item.disabled"
      >
        {{ translate ? $t(item[itemKey]) : item[itemKey] }}
      </option>
    </select>

    <!-- File name -->
    <div v-else-if="type === 'file-name'" class="form-item__file-name grid gtc1auto">
      <span class="flex aic cut pl1 pr1">{{ modelValue }}</span>
      <button type="button" class="flex aic jcc p0 h100" @click="$emit('removeFile')">
        <svg class="ic-14 ic-black">
          <use xlink:href="@/static/img/icons.svg#close" />
        </svg>
      </button>
    </div>

    <!-- Other inputs -->
    <input
      v-else
      v-model="modelValue"
      :type="type"
      :required="required"
      :disabled="disabled"
      :name="name"
      :min="type === 'number' && 0"
      :placeholder="$t(placeholder)"
      :autocomplete="autocomplete"
    >

    <!-- <small v-if="inValid" class="error-text">{{ $t('LongText') }}</small> -->
  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask'
export default {
  name: 'FormItem',
  components: { TheMask },

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
    type: {
      type: String,
      default: 'text',
      required: true
    },
    name: {
      type: String,
      default: 'name',
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
      validator: (p) => {
        return ['string', 'number', 'boolean'].includes(typeof p) || p === null
      }
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
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
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
    isPassword: true,
    inValid: false,
    focused: false,
    ip: {
      one: '',
      two: '',
      three: '',
      four: ''
    }
  }),

  computed: {
    modelValue: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }

  },

  watch: {
    ip: {
      deep: true,
      immediate: true,
      handler (val) {
        if (this.type === 'mask') {
          this.modelValue = val.one + '.' + val.two + '.' + val.three + '.' + val.four
        }
      }
    },
    modelValue () {
      // this.inValid = this.modelValue?.length && this.modelValue?.length > 240
      this.checkLength()
    }
  },

  methods: {

    blurHandler (item) {
      this.focused = false
      this.ip[item] = this.ip[item] > 255 ? 255 : this.ip[item] < 0 ? 0 : this.ip[item]
    },
    inputHandler (e, item) {
      if (Number(this.ip[item]) < 0) {
        this.ip[item] = 0
      }
      if (Number(this.ip[item]) > 255) {
        this.ip[item] = 255
      }
    },
    checkLength () {
      if (typeof this.modelValue === 'string') {
        let text = this.modelValue.trim()
        const limit = 240
        if (text.length <= limit) { return text }
        text = text.slice(0, limit)
        this.modelValue = text
      }
    }

  }
}
</script>

<style lang="scss" scoped>
option{
  min-height:280px !important;
overflow-y: scroll !important;
  scroll-behavior: auto !important;

}
.form-item {
  &__password {
    & > input {
      border-radius: $br 0 0 $br;
    }
    & > button {
      border-radius: 0 $br $br 0;
      border: $b1;
      border-left: 0;
      background-color: #f5f5f5;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      & > svg {
        opacity: .5;
      }

      &:hover {
        background-color: #EEE;
        border-color: #999;
        box-shadow: -1px 0 0 0 #999;

        & > svg {
          opacity: 1;
        }
      }
      &:focus {
        background-color: #EEE;
        border-color: #000;
        box-shadow: -1px 0 0 0 #000;

        & > svg {
          opacity: 1;
        }
      }
      &:active {
        background-color: #DDD;
      }
    }
  }

  &__ip {
    border: $b1;
    border-radius: $br;
    height: 30px;

    &:hover {
      border-color: #999;
    }
    &.active {
      border-color: #555;
    }

    & > input {
      border: 0;
      height: 100%;
      padding: 0;
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }
    }
  }

  &__file-name {
    background-color: #FFF;
    border: $b1;
    border-radius: $br;
    overflow: hidden;
    height: 30px;

    button {
      border: 0;
      background-color: $grey;
      width: 30px;
      cursor: pointer;

      &:hover {
        background-color: $grey-light;
      }
      &:active {
        background-color: $grey;
      }
    }
  }

  .error-text {
    font-size: 12px;
    color: $red;
  }
}
</style>
