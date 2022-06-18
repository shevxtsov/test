<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('MissionsEdit')"
    :is-loading="isLoad"
  >
    <template #body>
      <!-- Form -->
      <FormBase
        v-if="formData"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="formData.organization"
            label="organization"
            type="select"
            name="organization"
            placeholder="Select"
            :items="organizations"
            item-key="name"
            item-val="id"
            required
            disabled
          />
          <FormFolders
            v-model="selectedFolders"
            required
            disabled
            @removeFolder="removeFolder($event)"
          />
          <FormMultiselect
            v-model="formData.trafficKinds"
            label="trafficKinds"
            name="trafficKinds"
            placeholder="Select"
            :items="trafficKinds"
            item-key="name"
            item-val="code"
            required
            disabled
          />
          <FormItem
            v-model="formData.number"
            label="number"
            type="text"
            name="number"
            placeholder="task-123"
            autocomplete="off"
            required
            disabled
          />
          <FormItem
            v-model="formData.communicationObject"
            label="communicationObjects"
            type="select"
            name="communicationObjects"
            placeholder="Select"
            :items="communicationObjects"
            item-key="name"
            item-val="id"
            required
            disabled
          />
          <FormItem
            v-model="formData.targetAlias"
            label="targetAlias"
            type="text"
            name="targetAlias"
            placeholder=""
            autocomplete="off"
            required
            disabled
          />
          <FormItem
            v-model="formData.identificationKind"
            label="identificationKind"
            type="select"
            name="identificationKind"
            placeholder="Select"
            :translate="true"
            :items="identificationKind"
            required
            disabled
          />
          <FormItem
            v-model="formData.targetId"
            label="targetId"
            type="text"
            name="targetId"
            placeholder=""
            autocomplete="off"
            required
            disabled
          />
          <FormItem
            v-if="formData.cryptoKeyFileName"
            v-model="formData.cryptoKeyFileName"
            label="cryptoKey"
            type="file-name"
            name="cryptoKey"
            placeholder=""
            @removeFile="formData.cryptoKeyFileName = ''"
          />
          <FormFile
            v-else
            v-model="files"
            label="cryptoKey"
            name="cryptoKey"
            placeholder="Select"
          />
          <FormDatepicker
            v-model="formData.startedAt"
            label="InterceptStartedAt"
            name="startedAt"
            :disabled="isDisabledByDate && isEditable"
            required
          />
          <FormDatepicker
            v-model="formData.endedAt"
            label="InterceptEndedAt"
            name="endedAt"
            required
          />
          <FormItem
            v-model="formData.note"
            label="note"
            type="text"
            name="note"
            placeholder=""
            autocomplete="off"
          />
          <!-- <FormItem
            v-model="formData.state"
            label="state"
            type="select"
            name="state"
            placeholder="All"
            :items="missionStates"
            :translate="true"
          /> -->
        </template>
      </FormBase>

      <!-- Alert -->
      <BaseAlert
        v-else
        class="yellow m2"
        :text="$t('AlertSelectRow')"
      />
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'
import moment from 'moment'

export default {
  name: 'MissionsEdit',

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
    },
    selectedId: {
      type: [Number, String],
      default: 0
    },
    rows: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    formData: null,
    oldDate: '',
    isEditable: true,
    files: {},
    isOpen: true
  }),

  computed: {
    ...mapGetters({
      missionStates: 'helpers/missionStates',
      trafficKinds: 'helpers/trafficKinds',
      organizations: 'helpers/organizations',
      communicationObjects: 'helpers/communicationObjects',
      paginationStore: 'missions/pagination'
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
    isHasDate () {
      return !(this.formData.startedAt && this.formData.endedAt)
    },
    isDisabledByDate () {
      return moment() >= moment(this.oldDate)
    }
  },

  watch: {
    selectedId (val) {
      if (val && this.rows?.length) {
        this.getItem()
      } else {
        this.formData = null
      }
    }
  },

  mounted () {
    this.isOpen = true
    if (this.selectedId && this.rows?.length) {
      this.getItem()
    }
    this.$bus.$emit('folderbarDisabled', true)
  },

  methods: {
    ...mapMutations({
      setPage: 'missions/setPage'
    }),
    getItem () {
      const item = this.rows.find(item => item.id === this.selectedId)
      const res = cloneDeep(item)
      this.oldDate = res.startedAt
      this.formData = res
        ? {
            ...res,
            state: res?.state?.name,
            organization: res?.organization?.id || '',
            communicationObject: res?.communicationObject?.id || ''
          }
        : null
      this.files = res?.cryptoKey ? res?.cryptoKey : {}

      this.$emit('clearFolder')
      setTimeout(() => {
        this.selectedFolders.push(res.folder)
      }, 300)
    },
    send () {
      this.isLoad = true

      if (!this.selectedFolders.length) {
        this.$refs.formFolders.validate()
        return
      }

      const copyObj = { ...this.formData }
      const folder = this.selectedFolders.map(item => item.id)[0]
      const trafficKinds = copyObj?.trafficKinds?.map(item => item.code)
      const payload = { ...copyObj, folder, trafficKinds }
      delete payload.id

      this.$axios.$put('/missions/' + this.formData.id, payload)
        .then(() => {
          this.$bus.$emit('setToast', {
            title: 'SUCCESS',
            message: 'success_message_edit',
            class: 'green'
          })
          this.uploadFiles(this.formData.id)
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
      this.getItem()
    },
    uploadFiles (id) {
      if (Object.keys(this.files).length === 0) {
        this.isOpen = false
        this.page = 1
        this.reset()
        this.$bus.$emit('setToast', {
          title: 'SUCCESS',
          message: 'success_message_uploaded',
          class: 'green'
        })
        this.$emit('updateList')
      } else {
        const formData = new FormData()
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          formData.append('file', file)
        }

        this.$axios.$put('/missions/setCryptoKey/' + id, formData)
          .then(() => {
            this.isOpen = false
            this.page = 1
            this.reset()
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_uploaded',
              class: 'green'
            })
            this.$emit('updateList')
          })
          .catch((error) => {
            this.formData.id = id
            this.$bus.$emit('setToast', {
              title: error.response.data.status,
              message: error.response.data.message,
              class: 'red'
            })
          })
      }
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
