<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('ProcessingView')"
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
            required
            :disabled="auth && auth.roles.length && auth.roles[0].name !== 'ROLE_ADMIN'"
          />
          <FormFolders
            v-model="selectedFolders"
            required
            @removeFolder="removeFolder($event)"
          />
          <FormAutocomplate
            v-model="filters.mission"
            label="number"
            name="number"
            :items="missions"
            item-value="id"
            item-text="number"
            :placeholder="$t('Select')"
            required
            :disabled="selectedFolders && !selectedFolders.length"
          />
          <FormItem
            v-model="filters.trafficKinds"
            label="trafficKinds"
            type="select"
            name="trafficKinds"
            placeholder="All"
            :items="selectedMission && selectedMission.trafficKinds"
            item-key="name"
            item-val="id"
          />
          <FormItem
            v-model="filters.processedSign"
            label="processedSign"
            type="select"
            name="processedSign"
            placeholder="All"
            :items="processedSign"
          />
          <FormItem
            v-model="selectedMission.targetAlias"
            label="targetAlias"
            type="text"
            name="targetAlias"
            placeholder=""
            autocomplete="off"
            disabled
          />
          <FormItem
            v-model="selectedMission.identificationKind"
            label="identificationKind"
            type="select"
            name="identificationKind"
            placeholder="Select"
            :translate="true"
            :items="identificationKind"
            disabled
          />
          <FormDatepicker
            v-model="selectedMission.startedAt"
            label="InterceptStartedAt"
            name="startedAt"
            disabled
          />
          <FormDatepicker
            v-model="selectedMission.endedAt"
            label="InterceptEndedAt"
            name="endedAt"
            disabled
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ProcessingView',

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
    selectedMission: {},
    isOpen: true,
    missions: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'processing/pagination',
      filtersStore: 'processing/filters',
      defaultFilters: 'processing/defaultFilters'
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
      handler (val) {
        if (val?.length) {
          this.getMissions()
        } else {
          delete this.filters.mission
          delete this.filters.trafficKinds
          this.selectedMission = {}
        }
      }
    },
    'filters.mission': {
      deep: true,
      handler (val) {
        this.selectedMission = this.missions.find(item => item.id === val) || {}
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
      setFilters: 'processing/setFilters',
      setPage: 'processing/setPage'
    }),
    send () {
      this.isOpen = false
      this.page = 1

      const filters = {
        mission: this.selectedMission.id,
        processedSign: this.filters.processedSign,
        trafficKind: this.filters.trafficKinds
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
    getMissions () {
      if (this.selectedFolders?.length) {
        const str = this.setQueryToStr({ folder: this.selectedFolders[0].id, deletedSign: false })
        const url = str ? '/missions?search=' + str : '/missions'
        const params = {
          page: 0,
          size: 99999
        }
        this.$axios.$get(url, { params })
          .then((res) => {
            this.missions = res?._embedded?.missions || []
          })
          .catch((error) => {
            this.missions = []
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
        this.missions = []
      }
    }
  }
}
</script>
