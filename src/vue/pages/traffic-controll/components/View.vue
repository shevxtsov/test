<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('TrafficControllView')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormFolders
            v-model="selectedFolders"
            @removeFolder="removeFolder($event)"
          />
          <FormAutocomplate
            v-model="filters.mission"
            label="mission"
            name="missions"
            :items="items"
            item-value="id"
            item-text="number"
            :placeholder="$t('Select')"
            :disabled="!selectedFolders.length"
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
  name: 'TrafficControllView',

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
    items: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'traffic-controll/pagination',
      filtersStore: 'traffic-controll/filters',
      defaultFilters: 'traffic-controll/defaultFilters'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
    },
    selectedFolders: {
      get () { return this.folders },
      set (val) { this.$emit('change', val) }
    }
  },

  watch: {
    selectedFolders: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val?.length) {
          this.getMissions()
        } else {
          delete this.filters.mission
        }
      }
    }
  },

  mounted () {
    this.isOpen = true
    this.filters = { ...this.filtersStore }
  },

  methods: {
    ...mapMutations({
      setFilters: 'traffic-controll/setFilters',
      setPage: 'traffic-controll/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1
      this.setFilters({ ...this.filters })
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
    getMissions () {
      const folder = this.selectedFolders[0]?.id
      const str = this.setQueryToStr({ deletedSign: false, folder })
      const url = str ? '/missions?search=' + str : '/missions'
      const params = {
        page: 0,
        size: 99999
      }
      this.$axios.$get(url, { params })
        .then((res) => {
          this.items = res?._embedded?.missions
        })
        .catch(e => console.log(e))
    }
  }
}
</script>
