<template>
  <BaseSlider
    v-model="isOpen"
    :title="$t('FoldersEdit')"
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
            v-model="formData.parentFolder"
            label="parentFolder"
            type="select"
            name="parentFolder"
            placeholder="Select"
            :items="folders"
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
import { cloneDeep } from 'lodash'

export default {
  name: 'FoldersEdit',

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
    formData: null,
    isOpen: true,
    folders: []
  }),

  watch: {
    selectedId (val) {
      if (val && this.folders?.length) {
        this.recursiveFolderOptions()
        this.getItem()
      } else {
        this.formData = null
      }
    }
  },

  mounted () {
    this.isOpen = true
    if (this.selectedId) {
      this.recursiveFolderOptions()
      if (this.folders?.length) {
        this.getItem()
      }
    }
  },

  methods: {
    getItem () {
      let res = null
      for (let i = 0; i < this.rows.length; i++) {
        const el = this.rows[i]
        if (el.id === this.selectedId) {
          res = el
          break
        } else if (el.id !== this.selectedId && el?.subFolder?.length) {
          const subItem = this.findItem(el.subFolder)
          if (subItem) {
            res = subItem
          } else {
            continue
          }
        }
      }
      const item = cloneDeep(res)
      if (item) {
        this.formData = {
          id: item.id,
          name: item.name,
          parentFolder: item.parentFolderId || ''
        }
      }
    },
    findItem (subFolder) {
      let res = null
      for (let i = 0; i < subFolder.length; i++) {
        const item = subFolder[i]
        if (item.id === this.selectedId) {
          return item
        } else if (item?.subFolder?.length) {
          const subItem = this.findItem(item.subFolder)
          if (subItem) {
            res = subItem
          } else {
            continue
          }
        }
      }
      return res
    },
    recursiveFolderOptions () {
      this.folders = []
      for (let i = 0; i < this.rows.length; i++) {
        const item = this.rows[i]
        this.folders.push({
          disabled: item.id === this.selectedId,
          key: item.name,
          val: item.id
        })

        // If has childrens
        if (item?.subFolder?.length) {
          this.getChildrens(item.subFolder, item.name)
        }
      }
    },
    getChildrens (subFolder, parentName) {
      for (let i = 0; i < subFolder.length; i++) {
        const item = subFolder[i]
        const name = parentName + ' - ' + item.name
        const parentIndex = this.folders.findIndex(el => el.val === item.parentFolderId)
        let dis = false
        if (parentIndex !== -1) {
          dis = this.folders[parentIndex].disabled
        }
        this.folders.push({
          parent: item.parentFolderId,
          disabled: item.id === this.selectedId || dis,
          key: name,
          val: item.id
        })

        // If has childrens
        if (item?.subFolder?.length) {
          this.getChildrens(item.subFolder, name)
        }
      }
    },
    send () {
      if (this.selectedId) {
        this.isLoad = true
        delete this.formData.id
        if (!this.formData.parentFolder) {
          delete this.formData.parentFolder
        }
        this.$axios.$put('/folders/' + this.selectedId, this.formData)
          .then(() => {
            this.isOpen = false
            this.reset()
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'success_message_edit',
              class: 'green'
            })
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
      this.getItem()
    }
  }
}
</script>
