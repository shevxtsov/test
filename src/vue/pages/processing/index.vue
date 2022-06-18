<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      :has-add="false"
      :has-edit="false"
      :has-delete="false"
      :has-export="auth && auth.roles.length && auth.roles[0].name === 'ROLE_OBR'"
      @curAction="setCurrentTab"
    />

    <!-- Body -->
    <div class="wrapper grid gtcauto1">
      <!-- Sidebar -->
      <div class="sidebar">
        <FolderbarBase
          v-model="selectedFolders"
          :multiselect="false"
        />
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Form -->
        <component
          :is="currentComponent"
          v-if="currentComponent"
          :ref="curAction + '-id'"
          class="mb2"
          :rows="rows"
          :selected-id.sync="selectedId"
          :folders="selectedFolders"
          @clearFolder="selectedFolders = []"
          @updateList="onChange"
        />

        <!-- Response -->
        <BaseSlider
          v-model="isOpen"
          :title="$t('QueryResults')"
          :is-loading="isLoad"
          :is-over="true"
          :is-foot="true"
        >
          <template #body>
            <!-- Alert -->
            <BaseAlert
              v-if="rows && !rows.length && !isDownloaded"
              class="yellow m2"
              :text="$t('AlertEmpty')"
            />

            <!-- Table -->
            <BaseTable
              v-if="rows && rows.length"
              v-model="selectedId"
              :is-selected="true"
              :cols="cols"
              :rows="rows"
              @dblClicked="openModal"
            >
              <template #processedSign="{ cell }">
                <span class="marker" :class="cell ? 'green' : 'grey'">
                  {{ cell ? $t('Processed') : $t('NotProcessed') }}
                </span>
              </template>
              <template #processedUser="{ cell }">
                {{ cell ? cell.userId : '-' }}
              </template>
              <template #commentUser="{ cell }">
                {{ cell ? cell.userId : '-' }}
              </template>
            </BaseTable>

            <!-- Alert -->
            <BaseAlert
              v-if="rows && !rows.length && isDownloaded"
              class="yellow m2"
              :text="$t('AlertNotFound')"
            />
          </template>

          <template v-if="rows && rows.length" #foot>
            <BasePagination
              store="processing"
              class="p2"
              @onChange="onChange"
            />
          </template>
        </BaseSlider>
      </div>
    </div>

    <ProcessingModal
      v-if="isOpenModal && currentItem"
      ref="pmodal"
      :item="currentItem"
      @close="isOpenModal = false; currentItem = null"
      @updateList="onChange"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProcessingModal from './components/Modal.vue'
import pageMixins from '@/plugins/mixins/page'

export default {
  name: 'Processing',
  components: { ProcessingModal },
  mixins: [pageMixins],

  data: () => ({
    isOpenModal: false,
    currentItem: null,
    rows: [],
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('Processing')
    }
  },
  meta: {
    role: ['ROLE_OBR', 'ROLE_SUPERVISOR']
  },

  computed: {
    ...mapGetters({
      filtersStore: 'processing/filters',
      paginationStore: 'processing/pagination'
    }),
    cols () {
      const arr = [
        {
          key: 'id',
          show: true
        },
        {
          key: 'dataType',
          show: true
        },
        {
          key: 'processedSign',
          show: true
        },
        {
          key: 'processedUser',
          show: true
        },
        {
          key: 'comment',
          show: true
        },
        {
          key: 'commentUser',
          show: true
        }
      ]

      for (let i = 0; i < this.rows.length; i++) {
        const el = this.rows[i]
        for (const key in el) {
          if (Object.hasOwnProperty.call(el, key)) {
            if (key !== '_links' && key !== 'processedSign' && key !== 'processedUser' && key !== 'comment' && key !== 'commentUser') {
              const index = arr.findIndex(item => item.key === key)
              if (index === -1) {
                arr.push({
                  key,
                  show: true
                })
              } else {
                continue
              }
            }
          }
        }
      }

      return arr
    }
  },

  methods: {
    ...mapMutations({
      setPagination: 'processing/setPagination'
    }),
    onChange () {
      this.isLoad = true
      this.isOpen = true
      this.isDownloaded = false

      const str = this.setQueryToStr({ ...this.filtersStore })
      const params = {
        page: (this.paginationStore.page > 0 ? this.paginationStore.page - 1 : this.paginationStore.page),
        size: this.paginationStore.size
      }
      if (str) {
        params.search = str
      }
      this.rows = []
      this.$axios.$get('/surveillance', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          // this.selectedId = 0
          this.generateRows(res?._embedded)
          this.setPagination({ ...res?.page })
          this.currentItem = this.rows.find(item => item.id === this.selectedId) || null

          if (this.isOpenModal && this.currentItem) {
            this.$refs.pmodal.getRows()
          }
        })
        .catch((error) => {
          this.rows = []
          this.$bus.$emit('setToast', {
            title: error.response.data.status,
            message: error.response.data.message,
            class: 'red'
          })
        })
        .finally(() => {
          this.isDownloaded = true
          this.isLoad = false
        })
    },
    generateRows (obj) {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const el = obj[key]
          const newArr = el.map(item => ({ ...item, dataType: key }))
          this.rows = [...this.rows, ...newArr]
        }
      }
    },
    openModal () {
      this.currentItem = this.rows.find(item => item.id === this.selectedId) || null
      this.isOpenModal = true
    }
  }
}
</script>

<style>

</style>
