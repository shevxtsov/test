<template>
  <div
    class="form-item"
    :class="{
      'error' : error,
      'required' : required
    }"
  >
    <label class="mb05">{{ $t(label) }}</label>

    <!-- File input -->
    <div class="form-item__file">
      <input
        type="file"
        :required="required"
        :name="name"
        @change="setFile"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFile',

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
      type: [String, Array, Object, FileList],
      default: () => ({}),
      required: true
    },
    translate: {
      type: Boolean,
      default: false
    },
    error: {
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
    }
  },

  computed: {
    modelValue: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  },

  methods: {
    setFile (e) {
      this.modelValue = e.target.files

      // const reader = new FileReader()
      // reader.readAsDataURL(e.target.files[0])
      // reader.onload = function () {
      // }
      // reader.onerror = function (error) {
      //   console.log('Error: ', error)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  &__file {
    & > input {
      // border-radius: $br 0 0 $br;
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
}
</style>
