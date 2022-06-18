<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('CommunicationObjectsAdd')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        @resetAction="reset"
        @sendAction="send"
      >
        <!-- :is-reset="isResetForm(formData)" -->
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
              type="mask"
              name="ip"
              placeholder="ip"
              autocomplete="off"
              required
            />
            <FormItem
              v-model="formData.port"
              label="port"
              type="number"
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
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

const defaultFormData = {
  state: ''
}

export default {
  name: 'CommunicationObjectsAdd',

  data: () => ({
    formData: { ...defaultFormData },
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

  mounted () {
    this.isOpen = true
  },

  methods: {
    ...mapMutations({
      setPage: 'communication-objects/setPage'

    }),
    ...mapActions({
      getCommunicationObjects: 'helpers/getCommunicationObjects'
    }),
    send () {
      this.isLoad = true
      this.$axios.$post('/communicationObjects', this.formData, {
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
          this.getCommunicationObjects()
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
    }
  }
}
</script>
