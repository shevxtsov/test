export default {
  data () {
    return {
      curAction: 'View',
      currentComponent: null,
      pageSize: 20,
      selectedId: 0
    }
  },

  computed: {
    getSelectedId () {
      return this.rows?.length && (this.rows.findIndex(item => item.id === this.selectedId) !== -1) ? this.selectedId : 0
    },
    getSelectedIdRecursive () {
      let res = 0
      for (let i = 0; i < this.rows.length; i++) {
        const el = this.rows[i]
        if (el.id === this.selectedId) {
          res = el.id
          break
        } else if (el.id !== this.selectedId && el?.subFolder?.length) {
          const subItem = this.findItemRecursive(el.subFolder)
          if (subItem) {
            res = subItem.id
          } else {
            continue
          }
        }
      }
      return res
    }
  },

  watch: {
    curAction (val) {
      this.$router.push({ hash: '#' + val.toLowerCase() })
      this.$nextTick(() => this.setComponent())
    }
  },

  mounted () {
    const hash = this.$route.hash.substr(1)
    if (hash && (hash === 'view' || hash === 'add' || hash === 'delete' || hash === 'export')) {
      const resHash = hash.toLowerCase().replace(/(?<!\p{Lowercase})\p{Lowercase}/gu, ch => ch.toUpperCase())
      this.curAction = resHash
    } else {
      this.curAction = 'View'
      this.$router.push({ hash: '#view' })
    }
    this.setComponent()
  },

  methods: {
    setComponent () {
      this.currentComponent = () => import('@/pages' + this.$route.path + '/components/' + this.curAction)
    },
    setCurrentTab (tab) {
      if (this.$refs[this.curAction + '-id']) {
        this.$refs[this.curAction + '-id'].isOpen = true
      }
      this.curAction = tab
    },
    findItemRecursive (subFolder) {
      let res = 0
      for (let i = 0; i < subFolder.length; i++) {
        const item = subFolder[i]
        if (item.id === this.selectedId) {
          return item
        } else if (item?.subFolder?.length) {
          const subItem = this.findItemRecursive(item.subFolder)
          if (subItem) {
            res = subItem
          } else {
            continue
          }
        }
      }
      return res
    },
  }
}
