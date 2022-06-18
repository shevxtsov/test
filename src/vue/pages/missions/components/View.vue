<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('MissionsView')"
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
            v-model="filters.number"
            label="number"
            type="text"
            name="number"
            placeholder="task-123"
            autocomplete="off"
          />
          <FormItem
            v-model="filters.state"
            label="state"
            type="select"
            name="state"
            placeholder="All"
            :items="missionStates"
            :translate="true"
          />
          <FormItem
            v-model="filters.processedSign"
            label="processedSign"
            type="select"
            name="processedSign"
            placeholder="All"
            :items="processedSign"
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
  name: 'MissionsView',

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
      organizations: 'helpers/organizations',
      missionStates: 'helpers/missionStates',
      paginationStore: 'missions/pagination',
      filtersStore: 'missions/filters',
      defaultFilters: 'missions/defaultFilters'
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
    this.$bus.$emit('folderbarDisabled', false)
    this.filters = { ...this.filtersStore }

    this.$nextTick(() => {
      this.setBlockedData()
    })
  },

  methods: {
    ...mapMutations({
      setFilters: 'missions/setFilters',
      setPage: 'missions/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      const filters = { ...this.filters }
      if (this.selectedFolders?.length) {
        filters.folder = this.selectedFolders.map(item => item.id)
      }
      this.setFilters({ ...filters })
      this.$emit('updateList')
    },
    reset () {
      this.$emit('clearFolder')
      this.filters = { ...this.defaultFilters }
      this.setBlockedData()
    },
    removeFolder (id) {
      const index = this.selectedFolders.findIndex(item => item.id === id)
      if (index !== -1) {
        this.selectedFolders.splice(index, 1)
      }
    },
    setBlockedData () {
      if (this.auth && this.auth.roles.length && this.auth.roles[0].name !== 'ROLE_ADMIN') {
        this.filters.organization = this.auth.organization.id
      }
    }
  }
}
</script>
