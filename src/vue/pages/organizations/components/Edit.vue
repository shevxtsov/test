<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('OrganizationsEdit')"
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
  name: 'OrganizationsEdit',

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
      paginationStore: 'organizations/pagination'
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
      setPage: 'organizations/setPage'
    }),
    getItem () {
      const item = this.rows.find(item => item.id === this.selectedId)
      this.formData = cloneDeep(item)
    },
    send () {
      this.isLoad = true
      this.$axios.$put('/organizations/' + this.formData.id, this.formData, {
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
