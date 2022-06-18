<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('FoldersDelete')"
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
            :items="recursiveFolderOptions"
            item-value="val"
            item-text="key"
            :placeholder="$t('Select')"
            required
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
export default {
  name: 'FoldersDelete',

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
    rows: []
  }),

  computed: {
    recursiveFolderOptions () {
      let res = []
      for (let i = 0; i < this.rows.length; i++) {
        const item = this.rows[i]
        res.push({
          key: item.name,
          val: item.id
        })

        // If has childrens
        if (item?.subFolder?.length) {
          const subFolder = this.getChildrens(item.subFolder, item.name)
          res = res.concat(subFolder)
        }
      }
      console.log(res)
      return res
    },
    currentID: {
      get () { return this.selectedId },
      set (val) { this.$emit('update:selectedId', val) }
    }
  },

  mounted () {
    this.isOpen = true

    this.$axios.$get('/folders?page=0&size=9999')
      .then((res) => {
        this.rows = res?._embedded?.folders
      })
      .catch(e => console.log(e))
  },

  methods: {
    send () {
      if (this.selectedId !== 0) {
        this.isLoad = true
        this.$axios.$delete('/folders/' + this.selectedId)
          .then(() => {
            this.isOpen = false
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_delete',
              class: 'green'
            })
            this.reset()
            this.$emit('updateList')
          })
          .catch((error) => {
            this.$bus.$emit('setToast', {
              title: 'Ошибка',
              message: error.response.data.status + ' - ' + error.response.data.error,
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
    },
    getChildrens (subFolder, parentName) {
      let res = []
      for (let i = 0; i < subFolder.length; i++) {
        const item = subFolder[i]
        const name = parentName + ' - ' + item.name
        res.push({
          key: name,
          val: item.id
        })

        // If has childrens
        if (item?.subFolder?.length) {
          const childrens = this.getChildrens(item.subFolder, name)
          res = res.concat(childrens)
        }
      }
      return res
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
