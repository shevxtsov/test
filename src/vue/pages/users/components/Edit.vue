<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('UsersEdit')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        v-if="formData"
        @resetAction="reset"
        @sendAction="send"
      >
        <!-- :is-reset="isResetForm(formData)" -->
        <template #body>
          <FormItem
            v-model="formData.roles"
            label="roles"
            type="select"
            name="roles"
            placeholder="Select"
            :items="roles"
            :translate="true"
            item-val="id"
            item-key="name"
            required
          />
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
          <FormItem
            v-model="formData.userId"
            label="userId"
            type="text"
            name="userId"
            placeholder="Admin"
            autocomplete="off"
            required
          />
          <FormItem
            v-model="formData.password"
            label="password"
            type="password"
            name="password"
            placeholder="******"
            autocomplete="new-password"
          />
          <FormItem
            v-model="formData.exportAccess"
            label="exportAccess"
            type="select"
            name="exportAccess"
            :is-placeholder="false"
            :items="exportAccess"
            required
          />
          <FormItem
            v-model="formData.networkConfig"
            label="networkConfig"
            type="text"
            name="networkConfig"
            placeholder="123.456.789.123 / 255"
            autocomplete="off"
            required
          />
          <FormItem
            v-model="formData.stateAccess"
            label="stateAccess"
            type="select"
            name="stateAccess"
            :items="stateAccess"
            required
          />
          <FormDatepicker
            v-model="formData.startedAt"
            label="accountStartedAt"
            name="startedAt"
            required
          />
          <FormDatepicker
            v-model="formData.endedAt"
            label="accountEndedAt"
            name="endedAt"
            required
          />
          <FormDatepicker
            v-model="formData.passwordStartedAt"
            label="passwordStartedAt"
            name="passwordStartedAt"
            required
            :disabled="isHasDate"
            :range-date="{ start: formData.startedAt, end: formData.endedAt }"
          />
          <FormDatepicker
            v-model="formData.passwordEndedAt"
            label="passwordEndedAt"
            name="passwordEndedAt"
            required
            :disabled="isHasDate"
            :range-date="{ start: formData.startedAt, end: formData.endedAt }"
          />
          <FormFolders
            v-model="selectedFolders"
            required
            @removeFolder="removeFolder($event)"
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
  name: 'UsersEdit',

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
    isOpen: true
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'users/pagination'
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
    selectedId () {
      if (this.rows?.length) {
        this.getItem()
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
      setPage: 'users/setPage'
    }),
    getItem () {
      const item = this.rows.find(item => item.id === this.selectedId)
      const res = cloneDeep(item)
      this.formData = res
        ? {
            ...res,
            organization: res?.organization?.id,
            roles: res?.roles?.map(item => item.id)[0]
          }
        : null

      this.$emit('clearFolder')
      this.$nextTick(() => {
        for (let i = 0; i < res?.folders.length; i++) {
          const item = res?.folders[i]
          this.selectedFolders.push(item)
        }
      })
    },
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

      this.$axios.$patch('/users/' + res.id, res, {
        headers: {
          Authorization: true
        }
      })
        .then(() => {
          this.isOpen = false
          this.page = 1
          this.reset()
          this.$bus.$emit('setToast', {
            title: 'SUCCESS',
            message: 'success_message_edit',
            class: 'green'
          })
          this.$store.commit('setAudits', false)
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
    }
  }
}
</script>
