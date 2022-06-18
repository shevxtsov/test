<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('FoldersAdd')"
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
            v-model="formData.parentFolder"
            label="parentFolder"
            type="select"
            name="parentFolder"
            placeholder="Select"
            :items="recursiveFolderOptions"
          />
        </template>
      </FormBase>
    </template>
  </BaseSlider>
</template>

<script>
const defaultFormData = {
  name: '',
  parentFolder: ''
}

export default {
  name: 'FoldersAdd',

  model: {
    prop: 'selectedId',
    event: 'update'
  },

  props: {
    rows: {
      type: Array,
      default: () => []
    },
    selectedId: {
      type: [Number, String],
      default: 0
    }
  },

  data: () => ({
    formData: { ...defaultFormData },
    isOpen: true
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
      return res
    },
    selected: {
      get () { return this.selectedId },
      set (val) { this.$emit('update:selectedId', val) }
    }
  },

  watch: {
    selectedId () {
      this.setParentFolder()
    },
    'formData.parentFolder': {
      handler (val) {
        this.selected = val
      }
    }
  },

  mounted () {
    this.isOpen = true
    this.setParentFolder()
  },

  methods: {
    send () {
      this.isLoad = true
      if (!this.formData.parentFolder) {
        delete this.formData.parentFolder
      }
      this.$axios.$post('/folders', this.formData)
        .then(() => {
          this.isOpen = false
          this.page = 1
          this.reset()
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
    setParentFolder () {
      if (this.selectedId) {
        this.formData.parentFolder = this.selectedId
      } else {
        this.formData.parentFolder = ''
      }
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
