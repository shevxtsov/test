<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('MissionsAdd')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
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
            :disabled="auth && auth.roles.length && auth.roles[0].name !== 'ROLE_ADMIN'"
          />
          <FormFolders
            v-model="selectedFolders"
            required
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
          />
          <FormItem
            v-model="formData.number"
            label="number"
            type="text"
            name="number"
            placeholder="task-123"
            autocomplete="off"
            required
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
          />
          <FormItem
            v-model="formData.targetAlias"
            label="targetAlias"
            type="text"
            name="targetAlias"
            placeholder=""
            autocomplete="off"
            required
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
          />
          <FormItem
            v-model="formData.targetId"
            label="targetId"
            type="text"
            name="targetId"
            placeholder=""
            autocomplete="off"
            required
          />
          <FormFile
            v-model="files"
            label="cryptoKey"
            name="cryptoKey"
            placeholder="Select"
          />
          <FormDatepicker
            v-model="formData.startedAt"
            label="InterceptStartedAt"
            name="startedAt"
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
          <!-- informationFeature доделать! -->
          <FormItem
            v-model="formData.informationFeatureValue"
            type="select"
            label="informationFeature"
            name="informationFeature"
            placeholder="Select"
            :items="informationFeatureValue"
            item-key="name"
            item-val="code"
            required
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const defaultFormData = {
  organization: '',
  trafficKinds: [],
  informationFeature: [],
  identificationKind: ''

}

export default {
  name: 'MissionsAdd',

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
    files: {},
    isOpen: true,
    lang: ''

  }),

  computed: {
    ...mapGetters({
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
    informationFeatureValue () {
      console.log(this.lang)
      if (this.lang === 'ru') {
        return [
          { name: 'Полный контроль', code: 'TotalControl' }, { name: 'Статистический контроль', code: 'StatisticsControl' }
        ]
      } else {
        return [
          { name: 'Толық бақылау', code: 'TotalControl' }, { name: 'Статистикалық бақылау', code: 'StatisticsControl' }
        ]
      }
    }

  },
  watch: {

    '$i18n.locale': {
      immediate: true,
      handler (value) {
        this.lang = value
      }

    }
  },
  mounted () {
    this.isOpen = true
    this.$bus.$emit('folderbarDisabled', false)

    this.$nextTick(() => {
      if (this.auth && this.auth.roles.length && this.auth.roles[0].name !== 'ROLE_ADMIN') {
        this.formData.organization = this.auth.organization.id
      }
    })
  },

  methods: {
    ...mapMutations({
      setPage: 'missions/setPage'
    }),
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

      if (this.formData.id) {
        // PUT
        this.$axios.$put('/missions/' + this.formData.id, payload, {
          headers: {
            Authorization: true
          }
        })
          .then(() => {
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_add',
              class: 'green'
            })
            this.$store.commit('setAudits', false)
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
      } else {
        // POST
        this.$axios.$post('/missions', payload, {
          headers: {
            Authorization: true
          }
        })
          .then((res) => {
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_add',
              class: 'green'
            })
            this.$store.commit('setAudits', false)
            this.uploadFiles(res.id)
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
      }
    },
    reset () {
      this.formData = { ...defaultFormData }
    },
    uploadFiles (id) {
      if (Object.keys(this.files).length === 0) {
        this.isOpen = false
        this.page = 1
        this.reset()
        this.$emit('updateList')
      } else {
        const formData = new FormData()
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          formData.append('file', file)
        }

        this.$axios.$put('/missions/setCryptoKey/' + id, formData, {
          params: {
            url: 'UploadCryptoKey'
          },
          headers: {
            Authorization: true
          }
        })
          .then(() => {
            this.isOpen = false
            this.page = 1
            this.reset()
            this.$emit('updateList')
          })
          .catch((error) => {
            this.formData.id = id
            this.$bus.$emit('setToast', {
              title: error?.response?.data?.status || 'ERROR',
              message: error?.response?.data?.message || 'empty_error',
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
