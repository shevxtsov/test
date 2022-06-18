<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('TrafficControllAdd')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormFolders
            v-model="selectedFolders"
            required
            @removeFolder="removeFolder($event)"
          />
          <FormAutocomplate
            v-model="formData.mission"
            label="mission"
            name="missions"
            :items="items"
            item-value="id"
            item-text="number"
            :placeholder="$t('Select')"
            :disabled="!selectedFolders.length"
            required
          />
          <FormItem
            v-model="formData.targetIp"
            label="targetIp"
            type="text"
            name="targetIp"
            placeholder=""
            autocomplete="off"
            required
          />
          <FormItem
            v-model="formData.routerIp"
            label="routerIp"
            type="text"
            name="routerIp"
            placeholder=""
            autocomplete="off"
            required
          />
          <FormItem
            v-model="formData.startScenario"
            label="startScenario"
            type="text"
            name="startScenario"
            placeholder=""
            autocomplete="off"
            required
          />
          <FormItem
            v-model="formData.stopScenario"
            label="stopScenario"
            type="text"
            name="stopScenario"
            placeholder=""
            autocomplete="off"
            required
          />
          <FormDatepicker
            v-model="formData.startedAt"
            label="startedAt"
            name="startedAt"
            required
          />
          <FormDatepicker
            v-model="formData.endedAt"
            label="endedAt"
            name="endedAt"
            required
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const defaultFormData = {}

export default {
  name: 'TrafficControllAdd',

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
    isOpen: true,
    items: []
  }),

  computed: {
    ...mapGetters({
      roles: 'helpers/roles',
      organizations: 'helpers/organizations',
      paginationStore: 'traffic-controll/pagination'
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
      deep: true,
      immediate: true,
      handler (val) {
        if (val?.length) {
          this.getMissions()
        } else {
          delete this.formData.mission
        }
      }
    }
  },

  mounted () {
    this.isOpen = true
  },

  methods: {
    ...mapMutations({
      setPage: 'traffic-controll/setPage'
    }),
    send () {
      this.isLoad = true

      if (!this.selectedFolders.length) {
        this.$refs.formFolders.validate()
        return
      }

      const res = { ...this.formData }

      this.$axios.$post('/trafficController', res, {
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
            message: 'success_message_add',
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
      this.formData = { ...defaultFormData }
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
