<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('WhiteListsDelete')"
    :is-loading="isLoad"
  >
    <template #body>
      <FormBase
        reset-btn-name="Cancel"
        send-btn-name="Delete"
        :is-reset="currentID === 0"
        @resetAction="reset"
        @sendAction="send"
      >
        <template #body>
          <FormAutocomplate
            v-model="currentID"
            label="name"
            name="name"
            :items="items"
            item-value="id"
            item-text="name"
            :placeholder="$t('Select')"
            required
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'WhiteListsDelete',

  model: {
    prop: 'selectedId',
    event: 'update'
  },

  props: {
    selectedId: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    isOpen: true,
    items: null
  }),

  computed: {
    ...mapGetters({
      paginationStore: 'white-lists/pagination'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
    },
    currentID: {
      get () { return this.selectedId },
      set (val) { this.$emit('update:selectedId', val) }
    }
  },

  mounted () {
    this.isOpen = true

    this.$axios.$get('/whiteLists?page=0&size=9999')
      .then((res) => {
        this.items = res?._embedded?.whiteLists
      })
      .catch(e => console.log(e))
  },

  methods: {
    ...mapMutations({
      setPage: 'white-lists/setPage'
    }),
    send () {
      if (this.selectedId !== 0) {
        this.isLoad = true
        this.$axios.$delete('/whiteLists/' + this.selectedId, {
          headers: {
            Authorization: true
          }
        })
          .then(() => {
            this.isOpen = false
            this.page = 1
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_delete',
              class: 'green'
            })
            this.reset()
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
      }
    },
    reset () {
      this.currentID = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.base-content {
  background-color: $grey-light;
  min-height: calc(100vh - 100px);
}
</style>
