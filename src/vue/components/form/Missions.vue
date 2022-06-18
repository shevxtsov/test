<template>
  <div
    class="form-item"
    :class="{
      'error' : error || !valid,
      'required' : required
    }"
  >
    <label class="mb05">{{ $t('Missions') }}</label>

    <!-- Block -->
    <div :class="{ 'error': !valid }" class="missions">
      <!-- Head -->
      <div class="missions__head">
        <div class="checkbox">
          <input
            id="check-test"
            v-model="checkAll"
            type="checkbox"
            name="check-test"
            class="checkbox__input"
          >
          <label for="check-test" class="checkbox__label" @click.prevent="checkAllAction">
            <span class="checkbox__label-check">
              <svg class="ic-16 ic-white">
                <use xlink:href="~/static/img/icons.svg#check" />
              </svg>
            </span>

            <span class="checkbox__label-text">
              {{ $t('SelectAll') }}
            </span>
          </label>
        </div>
      </div>

      <!-- Body -->
      <div class="missions__body">
        <div
          v-for="item in rows"
          :key="item.id"
          class="checkbox"
        >
          <input
            :id="'check-' + item.id"
            v-model="val"
            type="checkbox"
            :name="'check-' + item.id"
            :value="item.id"
            class="checkbox__input"
          >
          <label :for="'check-' + item.id" class="checkbox__label">
            <span class="checkbox__label-check">
              <svg class="ic-16 ic-white">
                <use xlink:href="~/static/img/icons.svg#check" />
              </svg>
            </span>

            <span v-for="(col, i) in cols" :key="i" class="checkbox__label-text">
              {{ col.value }}: {{ item[col.key] }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Missions',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    cols: {
      type: Array,
      required: true,
      default: () => []
    },
    rows: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    error: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    checkAll: false,
    valid: true
  }),

  computed: {
    val: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    },
    checkAllState () {
      return this.rows.length && this.val.length !== this.rows.length
    }
  },

  watch: {
    value: {
      handler () {
        this.checkState()
      }
    },
    rows: {
      handler () {
        this.checkState()
      }
    }
  },

  methods: {
    checkAllAction () {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.val = [...this.rows].map(item => item.id)
      } else {
        this.val = []
      }
    },
    checkState () {
      this.valid = true
      this.checkAll = this.rows.length && this.val.length === this.rows.length
    },
    validate () {
      this.valid = !!this.val.length
      return this.valid
    }
  }
}
</script>

<style lang="scss" scoped>
.missions {
  background-color: #fff;
  border: $b1;
  border-radius: $br;
  height: 260px;
  overflow: hidden auto;

  &.error {
    border-color: $red;
  }

  &__head {
    .checkbox__label {
      border: 0;
      font-weight: bold;
    }
  }

  &__body {
    display: grid;
  }
}

// Checkbox
.checkbox {
  &__input {
    display: none;
  }

  &__label {
    display: grid;
    grid-template-columns: 15px 1fr;
    grid-gap: 15px;
    align-items: center;
    font-size: inherit;
    color: inherit;
    margin: 0;
    border-top: $b1;
    padding: 5px 10px;

    &-check {
      width: 20px;
      height: 20px;
      background-color: #FFF;
      border: $b1;
      border-radius: $br;
      display: flex;
      align-items: center;
      justify-content: center;

      & > svg {
        display: none;
      }
    }

    &:hover {
      background-color: $grey-light;

      &-check {
        border-color: #999;
      }
    }
  }

  &__input:checked + &__label {
    background-color: $primary-extra-light;
  }

  &__input:checked + &__label > &__label-check {
    border-color: transparent;
    background-color: $primary;

    & > svg {
      display: flex;
    }
  }
}
</style>
