<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('SanctionsRenew')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        v-if="formData && selectedId"
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
          />
          <FormFolders
            v-model="selectedFolders"
            required
            @removeFolder="removeFolder($event)"
          />
          <FormItem
            v-model="formData.userId"
            label="userId"
            type="select"
            name="userId"
            placeholder="Select"
            :items="users"
            item-key="userId"
            item-val="userId"
            required
          />
          <FormItem
            v-model="formData.mission"
            label="number"
            type="select"
            name="number"
            placeholder="Select"
            :items="missions"
            item-key="number"
            item-val="id"
            required
          />
          <FormDatepicker
            v-model="formData.startedAt"
            label="sanctionStartedAt"
            name="startedAt"
            required
            :disabled="disabled"
          />
          <FormDatepicker
            v-model="formData.endedAt"
            label="sanctionEndedAt"
            name="endedAt"
            required
          />
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

export default {
  name: 'SanctionsEdit',

  model: {
    prop: 'folders',
    event: 'change'
  },

  props: {
    folders: {
      type: Array,
      default: () => []
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
    isOpen: true,
    missions: [],
    users: []
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
    }
  },

  watch: {
    selectedId (val) {
      if (this.rows?.length && val) {
        this.getItem()
      }
    },
    selectedFolders: {
      handler () {
        this.getUsers()
      }
    },
    'formData.userId': {
      handler () {
        this.getMissions()
      }
    }
  },

  mounted () {
    this.isOpen = true
    if (this.rows?.length) {
      this.getItem()
    }
  },

  methods: {
    ...mapMutations({
      setPage: 'sanctions/setPage'
    }),
    send () {
      this.isLoad = true

      if (!this.selectedFolders.length) {
        this.$refs.formFolders.validate()
        return
      }

      const copyObj = { ...this.formData }
      const roles = [copyObj.roles]
      const folders = this.selectedFolders.map(item => item.id)
      delete copyObj.repassword
      delete copyObj.roles
      delete copyObj.deletedSign
      delete copyObj.deletedAt
      const res = { ...copyObj, folders, roles }

      this.$axios.$patch('/sanctions/' + res.id, res)
        .then(() => {
          this.isOpen = false
          this.page = 1
          this.reset()
          this.$bus.$emit('setToast', {
            title: 'SUCCESS',
            message: 'success_message_edit',
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
    },
    reset () {
      this.getItem()
    },
    removeFolder (id) {
      const index = this.selectedFolders.findIndex(item => item.id === id)
      if (index !== -1) {
        this.selectedFolders.splice(index, 1)
      }
    },
    getItem () {
      const item = this.rows.find(item => item.id === this.selectedId)
      const res = cloneDeep(item)
      this.formData = res
        ? {
            ...res,
            mission: res?.mission?.id,
            organization: res?.organization?.id,
            userId: res?.user?.userId
          }
        : null

      this.$emit('clearFolder')
      this.$nextTick(() => {
        if (res?.folder) {
          this.selectedFolders.push(res.folder)
        }
      })
      console.log(this.formData)
    },
    getUsers () {
      // this.formData.userId = ''
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
    },
    getMissions () {
      if (this.formData.userId) {
        const str = this.setQueryToStr({ ...this.filters, deletedSign: false, notAssignedToUser: this.formData.userId })
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
