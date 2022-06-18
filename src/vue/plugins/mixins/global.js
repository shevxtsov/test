import Vue from 'vue'
import m from 'moment'
import moment from 'moment-timezone'

// Global mixins
Vue.mixin({
  data: () => ({
    isLoad: false,
    isOpen: false,
    isDownloaded: false
  }),

  computed: {
    auth () {
      return this.$store.getters.auth || {}
    },
    kind () {
      return [
        {
          key: this.$t('ORG_SUPERVISOR'),
          val: 'ORG_SUPERVISOR'
        },
        {
          key: this.$t('ORG_ORM'),
          val: 'ORG_ORM'
        }
      ]
    },
    exportAccess () {
      return [
        {
          key: this.$t('Forbidden'),
          val: false
        },
        {
          key: this.$t('Allowed'),
          val: true
        }
      ]
    },
    stateAccess () {
      return [
        {
          key: this.$t('ENABLE'),
          val: 'ENABLE'
        },
        {
          key: this.$t('DISABLE'),
          val: 'DISABLE'
        }
      ]
    },
    deletedSign () {
      return [
        {
          key: this.$t('StatusNotDeleted'),
          val: false
        },
        {
          key: this.$t('StatusDeleted'),
          val: true
        }
      ]
    },
    processedSign () {
      return [
        {
          key: this.$t('notProcessedSigned'),
          val: false
        },
        {
          key: this.$t('processedSigned'),
          val: true
        }
      ]
    },
    identificationKind () {
      return [
        {
          key: 'IP_ADDRESS',
          val: 'IP_ADDRESS'
        },
        {
          key: 'ACCOUNT',
          val: 'ACCOUNT'
        }
      ]
    },
    stateList () {
      return [
        {
          key: 'Active',
          val: true
        },
        {
          key: 'NotActive',
          val: false
        }
      ]
    },
    requestStatus () {
      return [
        {
          key: 'OK',
          val: 'OK'
        },
        {
          key: 'ERROR',
          val: 'ERROR'
        }
      ]
    }
  },

  watch: {
    $route: {
      handler () {
        this.selectedFolders = []
        this.$store.commit('setAudits', true)
      }
    }
  },

  methods: {
    capitalize (s) {
      return s.toLowerCase().replace(/(?<!\p{Lowercase})\p{Lowercase}/gu, ch => ch.toUpperCase())
    },
    formatDate (val) {
      const date = moment(val)
      return date.isValid() ? date.tz('Asia/Almaty').format() : val
    },
    setErrors (errors) {
      this.cleanErrors()
      for (const item in errors) {
        if (Object.hasOwnProperty.call(errors, item)) {
          const noda = document.querySelector('div[data-name="' + item + '"]')
          if (noda) {
            noda.classList.add('error')
          }
        }
      }
    },
    cleanErrors () {
      const arr = document.querySelectorAll('div.form-item')
      for (const item of arr) {
        item.classList.remove('error')
      }
    },
    isResetForm (filters) {
      let res = false
      if (filters) {
        for (const key in filters) {
          if (Object.hasOwnProperty.call(filters, key)) {
            const item = filters[key]
            if (!res) {
              if (typeof (item) === 'string') {
                res = item !== ''
              } else if (Array.isArray(item)) {
                res = !!item.length
              } else if (typeof (item) === 'number') {
                res = item !== -1
              } else if (typeof (item) === 'object') {
                if (item !== null) { res = !!String(item) } else { res = !!item }
              } else if (typeof (item) === 'boolean') {
                res = item
              }
            }
          }
        }
      }
      return !res
    },
    setQueryToStr (payload) {
      let url = ''

      if (Array.isArray(payload)) {
        payload.forEach((item) => {
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              const element = item[key]
              if (element) {
                url = url + key + ':' + element + ','
              }
            }
          }
        })
      } else {
        for (const key in payload) {
          if (Object.hasOwnProperty.call(payload, key)) {
            const element = payload[key]
            if (element !== undefined && element !== null && element !== '' && element !== 0) {
              if (key === 'startedAt') {
                const curDate = m(element).format('YYYY-MM-DDTHH:mm:ss')
                url = url + key + '>' + curDate + ','
              } else if (key === 'endedAt') {
                const curDate = m(element).format('YYYY-MM-DDTHH:mm:ss')
                url = url + key + '<' + curDate + ','
              } else if (key === 'createdAt1') {
                const curDate = m(element).format('YYYY-MM-DDTHH:mm:ss')
                url = url + 'createdAt>' + curDate + ','
              } else if (key === 'createdAt2') {
                const curDate = m(element).format('YYYY-MM-DDTHH:mm:ss')
                url = url + 'createdAt<' + curDate + ','
              } else {
                url = url + key + ':' + element + ','
              }
            }
          }
        }
      }

      if (url.endsWith(',')) {
        url = url.slice(0, -1)
      }

      return url
    }
  }
})
