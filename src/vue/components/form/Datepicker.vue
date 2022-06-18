<template>
  <div
    class="form-item datepicker"
    :class="{
      required: required
    }"
  >
    <label class="mb05">{{ $t(label) }}</label>
    <date-picker
      v-model="val"
      placeholder="Выберите дату и время"
      value-type="format"
      type="datetime"
      :disabled-date="disabledDate"
      :input-attr="{ required: required, name: name }"
      :disabled="disabled"
      :lang="lang"
    >
      <template #footer>
        <div class="grid">
          <button class="btn btn-base" @click="setNow">
            Сейчас
          </button>
        </div>
      </template>
    </date-picker>
  </div>
</template>

<script>
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import '@/plugins/kz'
export default {
  components: { DatePicker },

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
    value: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: 'date',
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rangeDate: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    lang: ''
  }),
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {

    '$i18n.locale': {
      immediate: true,
      handler (value) {
        this.lang = value
      }
    }
  },
  methods: {
    setNow () {
      this.val = moment().format('YYYY-MM-DD hh:mm:ss')
    },
    disabledDate (date) {
      if (this.rangeDate) {
        const start = new Date(this.rangeDate.start)
        const countDays = moment(this.rangeDate.end).diff(start, 'days')

        return (
          date < start ||
          date > new Date(start.getTime() + countDays * 24 * 3600 * 1000)
        )
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  .mx-datepicker {
    display: block;
    width: auto;
  }
  .mx-input {
    box-shadow: none !important;
  }
}
</style>
