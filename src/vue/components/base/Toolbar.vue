<template>
  <div class="toolbar flex aic ggap2 pl3 pr3">
    <div class="flex aic ggap1">
      <slot name="btns">
        <button
          v-if="hasView"
          class="btn btn-base"
          :class="{ 'active' : active === 'View' || active === '' }"
          @click="clickAction('View')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#eye" />
          </svg>
          {{ $t('View') }}
        </button>
        <button
          v-if="hasAdd"
          class="btn btn-base"
          :class="{ 'active' : active === 'Add' }"
          @click="clickAction('Add')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#plus" />
          </svg>
          {{ $t('Add') }}
        </button>
        <button
          v-if="hasEdit"
          class="btn btn-base"
          :class="{ 'active' : active === 'Edit' }"
          :disabled="!selectedItem"
          @click="clickAction('Edit')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#edit" />
          </svg>
          {{ $t('Edit') }}
        </button>
        <button
          v-if="hasRenew"
          class="btn btn-base"
          :class="{ 'active' : active === 'Renew' }"

          @click="clickAction('Renew')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#edit" />
          </svg>
          {{ $t('Renew') }}
        </button>
        <button
          v-if="hasDelete"
          class="btn btn-base"
          :class="{ 'active' : active === 'Delete' }"
          @click="clickAction('Delete')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#delete" />
          </svg>
          {{ $t('Delete') }}
        </button>
        <button
          v-if="hasExport"
          class="btn btn-base"
          :class="{ 'active' : active === 'Export' }"
          @click="clickAction('Export')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#download" />
          </svg>
          {{ $t("SaveAs") }}
        </button>
        <button
          v-if="hasTaskResult"
          class="btn btn-base"
          :disabled="!selectedItem"
          @click="$emit('openTaskResult')"
        >
          <svg class="ic-16 ic-black">
            <use xlink:href="@/static/img/icons.svg#eye" />
          </svg>
          {{ $t("TaskResult") }}
        </button>
      </slot>

      <h1 class="toolbar__title ml1">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="toolbar__time mlauto flex aic ggap05">
      <svg class="ic-18 ic-black">
        <use xlink:href="~/static/img/icons.svg#clock" />
      </svg>
      <span>
        <small class="flex">{{ $t('ServerTime') }}:</small>
        <b>
          <VueTime
            :show-date="showDate"
            :show-day="showDate"
            :show-time="showTime"
            :options="options"
            :locales="locales"
            :time-zone="timeZone"
          />Часовой пояс: {{ test }}
        </b>
      </span>
    </div>
  </div>
</template>

<script>
import VueTime from 'vue-time'

export default {
  name: 'BaseToolbar',
  components: { VueTime },

  props: {
    active: {
      type: String,
      default: 'View'
    },
    selectedItem: {
      type: [String, Number],
      default: 0
    },
    hasView: {
      type: Boolean,
      default: true
    },
    hasAdd: {
      type: Boolean,
      default: true
    },
    hasEdit: {
      type: Boolean,
      default: true
    },
    hasRenew: {
      type: Boolean,
      default: false
    },
    hasDelete: {
      type: Boolean,
      default: true
    },
    hasExport: {
      type: Boolean,
      default: false
    },
    hasTaskResult: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    showDate: true,
    showDay: true,
    showTime: true,
    test: '+06:00',
    locales: 'ru-RU',
    options: {
      hour12: false,
      timeZone: 'Asia/Almaty',
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }
  }),

  computed: {
    pageTitle () {
      return this.$meta().resume().metaInfo.title
    }
  },

  methods: {
    clickAction (btn) {
      this.$emit('curAction', btn)

      const content = document.querySelector('.content')
      content.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  background-color: $grey;
  height: 50px;
  border-bottom: $b1;

  &__title {
    font-size: 16px;
  }

  &__time {
    small {
      font-size: 10px;
      color: #999;
      display: block;
    }
  }
}
</style>
