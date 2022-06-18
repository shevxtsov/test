<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('SanctionsAdd')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        body-class="gtc2 aifs"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <div class="grid gtcauto ggap2">
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
            />
            <FormFolders
              v-model="selectedFolders"
              required
              @removeFolder="removeFolder($event)"
            />
            <FormItem
              v-model="formData.user"
              label="userId"
              type="select"
              name="userId"
              placeholder="Select"
              :items="users"
              item-key="userId"
              item-val="id"
              required
            />
            <FormDatepicker
              v-model="formData.startedAt"
              label="sanctionStartedAt"
              name="startedAt"
              required
            />
            <FormDatepicker
              v-model="formData.endedAt"
              label="sanctionEndedAt"
              name="endedAt"
              required
            />
          </div>

          <div class="form-item">
            <FormMissions
              ref="itemMissions"
              v-model="missions"
              :rows="rows"
              :cols="cols"
              required
            />
          </div>
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const defaultFormData = {
  organization: '',
  user: ''
}

export default {
  name: 'SanctionsAdd',

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
    missions: [],
    isOpen: true,

    users: [],
    rows: [],
    cols: [
      {
        value: 'Номер задания',
        key: 'number'
      }
    ]
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'sanctions/pagination'
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
    }
  },

  watch: {
    selectedFolders: {
      handler () {
        this.getUsers()
      }
    },
    'formData.user': {
      handler () {
        this.getMissions()
      }
    }
  },

  mounted () {
    this.isOpen = true
  },

  methods: {
    ...mapMutations({
      setPage: 'sanctions/setPage'
    }),
    send () {
      if (!this.missions?.length) {
        this.$refs.itemMissions.validate()
        return
      }
      if (!this.selectedFolders.length) {
        this.$refs.formFolders.validate()
        return
      }

      this.isLoad = true
      const copyObj = { ...this.formData }
      const folder = this.selectedFolders.map(item => item.id)[0]
      const res = { ...copyObj, folder }

      if (this.missions?.length) {
        for (let i = 0; i < this.missions.length; i++) {
          res.mission = this.missions[i]

          this.$axios.$post('/sanctions', res)
            .then(() => {
              this.isOpen = false
              this.page = 1
              this.reset()
              this.$bus.$emit('setToast', {
                title: 'SUCCESS',
                message: 'success_message_add',
                class: 'green'
              })
              this.$emit('updateList')
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
      }
    },
    reset () {
      this.formData = { ...defaultFormData }
    },
    removeFolder (id) {
      const index = this.selectedFolders.findIndex(item => item.id === id)
      if (index !== -1) {
        this.selectedFolders.splice(index, 1)
      }
    },
    getUsers () {
      this.formData.user = ''
      const folders = this.selectedFolders?.length && this.selectedFolders[0].id

      if (folders) {
        const str = this.setQueryToStr({ folders, deletedSign: false, roles: 'ROLE_OBR' })
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
    },
    getMissions () {
      if (this.formData.user) {
        const str = this.setQueryToStr({ ...this.filters, deletedSign: false })
        const url = str ? '/missions?search=' + str : '/missions'
        const params = {
          page: 0,
          size: 99999,
          notAssignedToUser: this.formData.user
        }
        this.$axios.$get(url, { params })
          .then((res) => {
            this.rows = res?._embedded?.missions || []
          })
          .catch((error) => {
            this.rows = []
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
        this.rows = []
      }
    }
  }
}
</script>
