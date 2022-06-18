<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('AuditsView')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="filters.username"
            label="username"
            type="select"
            name="username"
            placeholder="Select"
            :items="users"
            item-key="userId"
            item-val="userId"
          />
          <FormItem
            v-model="filters.ip"
            label="ip"
            type="text"
            name="ip"
            placeholder="0.0.0.0"
            autocomplete="off"
          />
          <FormItem
            v-model="filters.requestStatus"
            label="requestStatus"
            type="select"
            name="requestStatus"
            placeholder="Select"
            :items="requestStatus"
          />
          <FormDatepicker
            v-model="requestTime"
            label="requestTime"
            name="requestTime"
          />
          <!-- <FormDatepicker
            v-model="filters.endedAt"
            label="endedAt"
            name="endedAt"
          /> -->
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AuditsView',

  data: () => ({
    filters: {},
    isOpen: true,
    users: [],
    items: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'audits/pagination',
      filtersStore: 'audits/filters',
      defaultFilters: 'audits/defaultFilters'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
    }
  },

  mounted () {
    this.isOpen = true
    this.getUsers()
    this.filters = { ...this.filtersStore }
  },

  methods: {
    ...mapMutations({
      setFilters: 'audits/setFilters',
      setPage: 'audits/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      const filters = { ...this.filters }
      if (filters.requestTime) {
        filters.requestTime = moment(filters.requestTime).format('YYYY-MM-DDTHH:mm:ss')
      } else {
        delete filters.requestTime
      }
      this.setFilters({ ...filters })
      this.$emit('updateList')
    },
    reset () {
      this.filters = { ...this.defaultFilters }
    },
    getUsers () {
      const str = this.setQueryToStr({ deletedSign: false })
      const url = str ? '/users?search=' + str : '/users'
      const params = {
        page: 0,
        size: 99999
      }
      this.$axios.$get(url, { params })
        .then((res) => {
          this.users = res?._embedded?.users || []
          this.users.unshift({ userId: 'Admin' })
        })
        .catch((error) => {
          this.users = []
          this.$bus.$emit('setToast', {
            title: error.response.data.status,
            message: error.response.data.message,
            class: 'red'
          })
        })
        .finally(() => {
          this.isDownloaded = true
          this.isLoad = false
        })
    }
  }
}
</script>
