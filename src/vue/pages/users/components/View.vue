<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('UsersView')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <!-- :is-reset="isResetForm(filters)" -->
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
          <FormItem
            v-model="filters.stateAccess"
            label="stateAccess"
            type="select"
            name="stateAccess"
            placeholder="All"
            :items="stateAccess"
          />
          <FormItem
            v-model="filters.deletedSign"
            label="deletedSign"
            type="select"
            name="deletedSign"
            placeholder="All"
            :items="deletedSign"
          />
          <FormItem
            v-model="filters.roles"
            label="roles"
            type="select"
            name="roles"
            placeholder="All"
            :items="roles"
            :translate="true"
            item-val="name"
            item-key="name"
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
          <FormFolders
            v-model="selectedFolders"
            @removeFolder="removeFolder($event)"
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'UsersView',

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
    isOpen: true
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'users/pagination',
      filtersStore: 'users/filters',
      defaultFilters: 'users/defaultFilters'
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
      setFilters: 'users/setFilters',
      setPage: 'users/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      const filters = { ...this.filters }
      if (this.selectedFolders?.length) {
        filters.folders = this.selectedFolders.map(item => item.id)
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
    }
  }
}
</script>
