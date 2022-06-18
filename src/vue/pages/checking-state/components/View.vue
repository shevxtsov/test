<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('CheckingStateView')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="filters.communicationObject"
            label="communicationObjects"
            type="select"
            name="communicationObjects"
            placeholder="Select"
            :items="communicationObjects"
            item-key="name"
            item-val="id"
            :required="true"
          />
          <FormFolders
            v-model="selectedFolders"
            :required="true"
            @removeFolder="removeFolder($event)"
          />
          <FormDatepicker
            v-model="filters.startedAt"
            label="startedAt"
            name="startedAt"
            :required="true"
          />
          <FormDatepicker
            v-model="filters.endedAt"
            label="endedAt"
            name="endedAt"
            :required="true"
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CheckingStateView',

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
      communicationObjects: 'helpers/communicationObjects',
      paginationStore: 'checking-state/pagination',
      filtersStore: 'checking-state/filters',
      defaultFilters: 'checking-state/defaultFilters'
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
  },

  methods: {
    ...mapMutations({
      setFilters: 'checking-state/setFilters',
      setPage: 'checking-state/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      const filters = { ...this.filters }
      if (this.selectedFolders?.length) {
        filters.folder = this.selectedFolders.map(item => item.id)
      }
      if (this.filters.startedAt || this.filters.endedAt) {
        filters.createdAt1 = this.filters.startedAt
        filters.createdAt2 = this.filters.endedAt

        delete filters.startedAt
        delete filters.endedAt
      }
      this.setFilters({ ...filters })
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
