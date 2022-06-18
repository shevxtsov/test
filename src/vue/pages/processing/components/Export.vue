<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('ProcessingExport')"
  >
    <template #body>
      <FormBase
        send-btn-name="Apply"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="formData.organization"
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
            v-model="formData.mission"
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
            v-model="formData.processedSign"
            label="processedSign"
            type="select"
            name="processedSign"
            placeholder="All"
            :items="processedSign"
          />
          <FormItem
            v-model="formData.stateIntercept"
            label="stateIntercept"
            type="select"
            name="stateIntercept"
            :translate="true"
            :is-placeholder="false"
            :items="stateIntercepts"
            required
          />
          <FormItem
            v-model="formData.ftpId"
            label="ftpId"
            type="select"
            name="ftpId"
            placeholder="Select"
            :items="ftpIds"
            :disabled="formData.stateIntercept === 1"
            :required="formData.stateIntercept === 2"
          />
          <FormItem
            v-model="formData.archiveName"
            label="archiveName"
            type="text"
            name="archiveName"
            placeholder=""
            autocomplete="off"
            required
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
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'

const defaultFormData = {
  organization: '',
  stateIntercept: 1,
  ftpId: '',
  processedSign: '',
  archiveName: 'task_' + moment().format('YYYY-MM-DD'),
  missions: []
}

export default {
  name: 'ProcessingExport',

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
    formData: { ...defaultFormData },
    selectedMission: {},
    isOpen: true,
    missions: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'processing/pagination'
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
    },
    stateIntercepts () {
      return [
        {
          key: 'ToDesctop',
          val: 1
        },
        {
          key: 'ToFTP',
          val: 2
        }
      ]
    },
    ftpIds () {
      return [
        {
          key: 'FTP-1',
          val: 1
        },
        {
          key: 'FTP-2',
          val: 2
        }
      ]
    }
  },

  watch: {
    selectedFolders: {
      handler (val) {
        if (val?.length) {
          this.getMissions()
        } else {
          delete this.formData.mission
          delete this.formData.trafficKinds
          this.selectedMission = {}
        }
      }
    },
    'formData.mission': {
      deep: true,
      handler (val) {
        this.selectedMission = this.missions.find(item => item.id === val) || {}
      }
    },
    'formData.stateIntercept': {
      handler (val) {
        if (val === 1) {
          this.formData.ftpId = ''
        }
      }
    }
  },

  mounted () {
    this.isOpen = true
    this.$nextTick(() => {
      if (this.auth && this.auth.roles.length && this.auth.roles[0].name !== 'ROLE_ADMIN') {
        this.formData.organization = this.auth.organization.id
      }
    })
  },

  methods: {
    ...mapMutations({
      setformData: 'processing/setformData',
      setPage: 'processing/setPage'
    }),
    send () {
      // if (!this.formData?.missions?.length) {
      //   this.$refs.itemMissions.validate()
      //   return
      // }
      if (!this.selectedFolders.length) {
        this.$refs.formFolders.validate()
        return
      }

      this.isLoad = true
      const params = {
        UserId: this.$store?.getters?.auth?.userId,
        missionIds: this.formData.mission.toString(),
        archiveName: this.formData.archiveName,
        ftpId: this.formData.ftpId
      }
      if (!params.ftpId) {
        delete params.ftpId
      }

      this.$axios.$get('/export/save', { params })
        .then(() => {
          this.$bus.$emit('setToast', {
            title: 'SUCCESS',
            message: 'success_message_export',
            class: 'green'
          })
          this.isOpen = false
          this.$bus.$emit('openExportList')
          this.reset()
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
    reset () {
      this.$emit('clearFolder')
      this.formData = { ...defaultFormData }
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
