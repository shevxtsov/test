<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('SanctionsView')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="filters.organization"
            label="organization"
            type="select"
            name="organization"
            placeholder="All"
            :items="organizations"
            item-key="name"
            item-val="id"
            :disabled="auth && auth.roles.length && auth.roles[0].name !== 'ROLE_ADMIN'"
          />
          <FormFolders
            v-model="selectedFolders"
            @removeFolder="removeFolder($event)"
          />
          <FormItem
            v-model="filters.user"
            label="userId"
            type="select"
            name="userId"
            placeholder="Select"
            :items="users"
            item-key="userId"
            item-val="id"
            :disabled="selectedFolders && !selectedFolders.length"
          />
          <FormItem
            v-model="filters.deletedSign"
            label="deletedSign"
            type="select"
            name="deletedSign"
            placeholder="All"
            :items="deletedSign"
          />
          <FormDatepicker
            v-model="filters.startedAt"
            label="startedAt"
            name="startedAt"
          />
          <FormDatepicker
            v-model="filters.endedAt"
            label="endedAt"
            name="endedAt"
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SanctionsView',

  model: {
    prop: 'folders',
    event: 'change'
  },

  props: {
    folders: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data: () => ({
    filters: {},
    isOpen: true,
    users: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'sanctions/pagination',
      filtersStore: 'sanctions/filters',
      defaultFilters: 'sanctions/defaultFilters'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
    },
    selectedFolders: {
      get () {
        return this.folders
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },

  watch: {
    selectedFolders: {
      deep: true,
      immediate: true,
      handler () {
        this.getUsers()
      }
    }
  },

  mounted () {
    this.isOpen = true
    this.filters = { ...this.filtersStore }

    this.$nextTick(() => {
      if (this.auth && this.auth.roles.length && this.auth.roles[0].name !== 'ROLE_ADMIN') {
        this.filters.organization = this.auth.organization.id
      }
    })
  },

  methods: {
    ...mapMutations({
      setFilters: 'sanctions/setFilters',
      setPage: 'sanctions/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      const filters = { ...this.filters }
      if (this.selectedFolders?.length) {
        filters.folder = this.selectedFolders.map(item => item.id)
      }
      this.setFilters({ ...filters })
      this.$store.commit('setAudits', true)
      this.$emit('updateList')
    },
    reset () {
      this.$emit('clearFolder')
      this.filters = { ...this.defaultFilters }
    },
    removeFolder (id) {
      const index = this.selectedFolders.findIndex(item => item.id === id)
      if (index !== -1) {
        this.selectedFolders.splice(index, 1)
      }
    },
    getUsers () {
      this.filters.userId = ''
      const folders = this.selectedFolders?.length && this.selectedFolders[0].id

      if (folders) {
        const str = this.setQueryToStr({ folders, deletedSign: false })
        const url = str ? '/users?search=' + str : '/users'
        const params = {
          page: 0,
          size: 99999
        }
        this.$axios.$get(url, { params })
          .then((res) => {
            this.users = res?._embedded?.users || []
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
      } else {
        this.users = []
      }
    }
  }
}
</script>
