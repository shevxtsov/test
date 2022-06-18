<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('OrganizationsAdd')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
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
          <FormItem
            v-model="formData.kind"
            label="kind"
            type="select"
            name="kind"
            placeholder="Select"
            :items="kind"
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
  kind: ''
}

export default {
  name: 'OrganizationsAdd',

  data: () => ({
    formData: { ...defaultFormData },
    isOpen: true
  }),

  computed: {
    ...mapGetters({
      paginationStore: 'organizations/pagination'
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
      setPage: 'organizations/setPage'
    }),
    send () {
      this.isLoad = true
      this.$axios.$post('/organizations', this.formData, {
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
