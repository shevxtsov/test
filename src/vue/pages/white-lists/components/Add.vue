<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('WhiteListsAdd')"
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
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const defaultFormData = {
  name: '',
  identificationKind: ''
}

export default {
  name: 'WhiteListsAdd',

  data: () => ({
    formData: { ...defaultFormData },
    isOpen: true
  }),

  computed: {
    ...mapGetters({
      paginationStore: 'white-lists/pagination'
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
      setPage: 'white-lists/setPage'
    }),
    send () {
      this.isLoad = true
      this.$axios.$post('/whiteLists', this.formData, {
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
    }
  }
}
</script>
