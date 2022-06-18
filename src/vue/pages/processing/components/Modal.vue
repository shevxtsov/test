<template>
  <div class="processing-modal">
    <div v-click-outside="() => { $emit('close') }" class="processing-modal__content">
      <BaseLoad v-if="isLoad" class="white-transparent" />

      <!-- Head -->
      <div class="processing-modal__content-head flex aic jcsb pr2">
        <div class="btn-group flex aic">
          <!-- Tabs -->
          <div class="btn-group__item flex aic ggap2">
            <button
              class="btn btn-base sm"
              :class="{ 'active' : currentTab === 1 }"
              @click="currentTab = 1"
            >
              {{ $t('Properties') }}
            </button>
            <button
              class="btn btn-base sm"
              :class="{ 'active' : currentTab === 2 }"
              @click="currentTab = 2"
            >
              {{ $t('ViewHtml') }}
            </button>
          </div>

          <!-- Actions -->
          <div class="btn-group__item flex aic ggap2">
            <button
              class="btn btn-base sm"
              :disabled="item.processedSign"
              @click="sendProcessing"
            >
              <svg class="ic-14 ic-black">
                <use xlink:href="~/static/img/icons.svg#check_circle" />
              </svg>
              {{ $t('Processing') }}
            </button>

            <div v-click-outside="() => isComment = false" class="ddown ddown-right">
              <button class="btn btn-base sm" @click="isComment = !isComment">
                <svg class="ic-14 ic-black">
                  <use xlink:href="~/static/img/icons.svg#message_square" />
                </svg>
                {{ $t('note') }}
              </button>

              <div v-if="isComment" class="ddown__body p2">
                <textarea
                  id="comment"
                  v-model="newComment"
                  name="comment"
                  cols="50"
                  rows="10"
                  placeholder="Текст примечания"
                />
                <div class="flex aic jcfe ggap1 mt1">
                  <button class="btn btn-base" @click="cancelComment">
                    {{ $t('Cancel') }}
                  </button>
                  <button class="btn btn-primary" :disabled="!newComment" @click="sendComment">
                    {{ $t('Send') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-base sm" @click="$emit('close')">
          <svg class="ic-14 ic-black">
            <use xlink:href="~/static/img/icons.svg#close" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="processing-modal__content-body">
        <!-- Tab content 2 -->
        <table v-if="currentTab === 1">
          <thead>
            <th>{{ $t('Properties') }}</th>
            <th>{{ $t('value') }}</th>
          </thead>
          <tbody>
            <tr v-for="(row, index) of rows" :key="'row-' + index">
              <td class="cut">
                <b>{{ $t(row.property) }}</b>
              </td>
              <td>
                <template v-if="row.property === 'processedSign'">
                  <span class="marker" :class="row.value ? 'green' : 'grey'">
                    {{ row.value ? $t('Processed') : $t('NotProcessed') }}
                  </span>
                </template>
                <template v-else-if="row.property === 'processedUser' || row.property === 'commentUser'">
                  {{ row.value && row.value.userId ? row.value.userId : '-' }}
                </template>
                <template v-else>
                  {{ row.value || '-' }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tab content 2 -->
        <HtmlBody v-if="currentTab === 2" :host="item.host" :html-body="item.rawHtmlBodyByte" />
      </div>
    </div>
  </div>
</template>

<script>
import HtmlBody from './HtmlBody.vue'

export default {
  name: 'ProcessingModal',
  components: { HtmlBody },

  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      newComment: '',
      isComment: false,
      isLoad: false,

      currentTab: 1,
      rows: []
    }
  },

  watch: {
    item: {
      immediate: true,
      deep: true,
      handler () {
        this.getRows()
      }
    }
  },

  methods: {
    getRows () {
      this.rows = []
      for (const key in this.item) {
        if (Object.hasOwnProperty.call(this.item, key)) {
          if (key !== '_links' && key !== 'rawHtmlBody' && key !== 'rawHtmlBodyByte') {
            const value = this.item[key]
            this.rows.push({
              property: key,
              value
            })
          }
        }
      }

      if (this.item.comment) {
        this.newComment = this.item.comment
      }
    },
    cancelComment () {
      this.isComment = false
      this.newComment = this.selected.comment
    },
    sendComment () {
      this.isLoad = true
      this.isComment = false
      const payload = {
        processedSign: this.item.processedSign,
        comment: this.newComment,
        commentUser: this.auth.id
      }
      this.$axios.$put('/surveillance/' + this.item.id, payload, {
        headers: {
          Authorization: true
        }
      })
        .then(() => {
          this.$store.commit('setAudits', false)
          this.$emit('updateList')
        })
        .catch((error) => {
          this.$bus.$emit('setToast', {
            title: error.response.data.status,
            message: error.response.data.message,
            class: 'red'
          })
        })
        .finally(() => {
          this.isLoad = false
        })
    },
    sendProcessing () {
      this.isLoad = true
      const payload = {
        processedSign: true,
        processedUser: this.auth.id
      }
      this.$axios.$put('/surveillance/' + this.item.id, payload)
        .then(() => {
          this.$store.commit('setAudits', false)
          this.$emit('updateList')
        })
        .catch((error) => {
          this.$bus.$emit('setToast', {
            title: error.response.data.status,
            message: error.response.data.message,
            class: 'red'
          })
        })
        .finally(() => {
          this.isLoad = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.processing-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    width: 90vw;
    height: 90vh;
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: $br;
    overflow: hidden;
    position: relative;

    &-head {
      background-color: $grey-light;
      height: 50px;
      border-bottom: $b1;

      .btn-group {
        height: 100%;

        &__item {
          height: 100%;
          border-right: $b1;
          padding: 0 20px;
        }
      }
    }

    &-body {
      background-color: #FFF;
      overflow: auto;

      table {
        padding: 0;
        border-collapse: collapse;
        width: 100%;

        th, td {
          padding: 10px 20px;
        }

        th {
          font-weight: normal;
          font-size: 12px;
          color: #777;
          text-align: left;
          border-bottom: $b1;
        }

        tr {
          background-color: #FFF;

          &:hover {
            background-color: $grey-light;
          }
        }

        td {
          border-right: $b1;
          border-bottom: $b1;

          &:first-child {
            width: 220px;
          }
          &:last-child {
            border-right: 0;
          }
        }
      }
    }
  }
}
</style>
