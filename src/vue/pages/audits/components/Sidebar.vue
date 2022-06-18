<template>
  <div v-if="item" class="action-logs-sidebar">
    <div class="action-logs-sidebar__head flex aic jcsb ggap2 pl2 pr2">
      <h4 class="m0">
        {{ $t('requestParameters') }}
      </h4>
      <button class="flex aic jcc" @click="$emit('close')">
        <svg class="ic-14 ic-primary">
          <use xlink:href="~/static/img/icons.svg#close" />
        </svg>
      </button>
    </div>

    <div class="action-logs-sidebar__body">
      <table class="action-logs-sidebar__body-item">
        <tbody>
          <tr>
            <td><b>{{ $t('ip') }}:</b></td>
            <td>{{ item.ip }}</td>
          </tr>
          <tr>
            <td><b>{{ $t('requestUrl') }}:</b></td>
            <td>{{ $t(capitalize(item.requestUrl)) }}</td>
          </tr>
          <tr>
            <td><b>{{ $t('requestMethod') }}:</b></td>
            <td>{{ item.requestMethod.toUpperCase() }}</td>
          </tr>
          <tr>
            <td><b>{{ $t('requestStatus') }}:</b></td>
            <td>
              <span class="marker" :class="requestStatusColor(item.requestStatus)">
                {{ item.requestStatus }}
              </span>
            </td>
          </tr>
          <tr>
            <td><b>{{ $t('userId') }}:</b></td>
            <td>{{ item.username || '-' }}</td>
          </tr>
          <tr>
            <td><b>{{ $t('createdAt') }}:</b></td>
            <td>{{ item.requestTime }}</td>
          </tr>
        </tbody>
      </table>

      <hr class="dashed mt2 mb2">

      <template v-if="isNoEmpty">
        <b class="flex pl2 pr2 mb1">{{ $t('RequestParameters') }}</b>
        <table class="action-logs-sidebar__body-tabl">
          <thead>
            <th>{{ $t('requestKey') }}</th>
            <th>{{ $t('requestValue') }}</th>
          </thead>

          <tbody>
            <tr v-if="list.id">
              <td>ID</td>
              <td><span class="break">{{ list.id }}</span></td>
            </tr>
            <tr v-for="(value, key) in list.params" :key="key">
              <td>{{ $t(key) }}</td>
              <td>
                <template v-if="key === 'search'">
                  <div class="tags flex fw ggap05">
                    <span
                      v-for="tag of tags(value)"
                      :key="tag"
                      class="tags__item marker"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </template>
                <span v-else class="break">{{ $t(value) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- Alert -->
      <BaseAlert
        v-else
        class="yellow m2"
        :text="$t('RequestParametrsEmpty')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionLogsSidebar',

  props: {
    selectedId: {
      type: Number,
      default: 0
    },
    rows: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    item () {
      return this.rows.find(item => item.id === this.selectedId) || null
    },
    list () {
      let parametrs = null

      if (this.item.requestParameters) {
        parametrs = JSON.parse(this.item.requestParameters)
        delete parametrs?.params?.id
        delete parametrs?.params?._links
        delete parametrs?.params?.page
        delete parametrs?.params?.size
        delete parametrs?.params?.oldPassword
        delete parametrs?.params?.newPassword
        delete parametrs?.params?.url
      }

      return parametrs
    },
    isNoEmpty () {
      return !!this.list.id || Object.keys(this.list.params).length
    }
  },

  watch: {
    selectedId (val) {
      if (!val || !this.item) {
        this.$emit('close')
      }
    }
  },

  methods: {
    requestStatusColor (status) {
      switch (status) {
        case 200:
        case 201:
        case 204:
          return 'green'

        default:
          return 'red'
      }
    },
    tags (str) {
      return str.split(',') || []
    }
  }
}
</script>

<style lang="scss" scoped>
.action-logs-sidebar {
  position: fixed;
  right: 0;
  top: 100px;
  bottom: 0;
  height: calc(100vh - 100px);
  z-index: 999;
  background-color: #FFF;
  width: 450px;
  border-left: $b1;
  box-shadow: 0 0 30px -2px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto 1fr;

  &__head {
    border-bottom: $b1;
    height: 40px;

    & > h4 {
      font-size: inherit;
      font-weight: normal;
    }

    & > button {
      border: 0;
      background-color: transparent;
      width: 30px;
      height: 30px;
      border-radius: $br;
      cursor: pointer;

      &:hover {
        background-color: $primary;

        & > svg {
          fill: #FFF;
        }
      }
    }
  }

  &__body {
    overflow: auto;
    &-item {
      td {
        padding: 5px 20px;
      }
    }

    &-tabl {
      width: 100%;
      padding: 0;
      border-collapse: collapse;

      th {
        text-align: left;
        font-weight: normal;
        font-size: 12px;
        color: #999;
        padding: 5px 20px;
        background-color: $grey-light;
      }

      td {
        border-bottom: $b1;
        border-right: $b1;
        padding: 5px 20px;

        &:last-child {
          border-right: 0;
        }
      }
    }
  }
}
</style>
