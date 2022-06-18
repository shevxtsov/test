<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('CommunicationObjectsEdit')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        v-if="formData"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormItem
            v-model="formData.name"
            label="name"
            type="text"
            name="name"
            placeholder="name"
            autocomplete="off"
            required
          />
          <div class="grid ggap1 gtc21">
            <FormItem
              v-model="formData.ip"
              label="ip"
              type="text"
              name="ip"
              placeholder="ip"
              autocomplete="off"
              required
            />
            <FormItem
              v-model="formData.port"
              label="port"
              type="text"
              name="port"
              placeholder="port"
              autocomplete="off"
              required
            />
          </div>
          <FormItem
            v-model="formData.state"
            label="state"
            type="select"
            name="state"
            placeholder="Select"
            :translate="true"
            :items="stateList"
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
  name: 'CommunicationObjectsEdit',

  props: {
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
      paginationStore: 'communication-objects/pagination'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
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
      setPage: 'communication-objects/setPage'
    }),
    getItem () {
      const item = this.rows.find(item => item.id === this.selectedId)
      this.formData = cloneDeep(item)
    },
    send () {
      this.isLoad = true
      this.$axios.$put('/communicationObjects/' + this.formData.id, this.formData, {
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
    }
  }
}
</script>
