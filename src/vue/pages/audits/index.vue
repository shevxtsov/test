<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      :has-add="false"
      :has-edit="false"
      :has-delete="false"
      @curAction="setCurrentTab"
    />
    <!-- :has-export="true" -->

    <!-- Body -->
    <div class="wrapper grid">
      <!-- Content -->
      <div class="content">
        <!-- Form -->
        <component
          :is="currentComponent"
          v-if="currentComponent"
          :ref="curAction + '-id'"
          class="mb2"
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
              @dblClicked="selectedId = $event; isOpenSidebar = true"
            >
              <template #requestParameters="{ row }">
                <button class="btn btn-base" @click.stop="selectedId = row.id; isOpenSidebar = true">
                  {{ $t('View') }}
                </button>
              </template>
              <template #requestStatus="{ cell }">
                <span class="marker" :class="requestStatusColor(cell)">
                  {{ cell }}
                </span>
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
              store="audits"
              class="p2"
              @onChange="onChange"
            />
          </template>
        </BaseSlider>

        <!-- Sidebar -->
        <Sidebar
          v-if="isOpenSidebar && selectedId"
          :rows="rows"
          :selected-id="selectedId"
          @close="isOpenSidebar = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Sidebar from './components/Sidebar.vue'
import pageMixins from '@/plugins/mixins/page'

export default {
  name: 'Audits',
  components: { Sidebar },
  mixins: [pageMixins],

  data: () => ({
    isOpenSidebar: false,
    rows: [],
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('Audits')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_OBR', 'ROLE_SUPERVISOR', 'ROLE_ADMIN_HARDWARE']
  },

  computed: {
    ...mapGetters({
      filtersStore: 'audits/filters',
      paginationStore: 'audits/pagination'
    }),
    cols () {
      return [
        {
          key: 'ip',
          show: true
        },
        {
          key: 'username',
          show: true
        },
        {
          key: 'requestUrl',
          show: true,
          formatter: (val) => {
            return this.$t(this.capitalize(val))
          }
        },
        {
          key: 'requestMethod',
          show: true,
          formatter: (val) => {
            return val.toUpperCase()
          }
        },
        {
          key: 'requestStatus',
          show: true
        },
        {
          key: 'requestTime',
          show: true
          // formatter: (val) => {
          //   return this.formatDate(val)
          // }
        },
        {
          key: 'requestParameters',
          show: true
        }
      ]
    }
  },

  watch: {
    selectedId (val) {
      if (!val) {
        this.isOpenSidebar = false
      }
    }
  },

  methods: {
    ...mapMutations({
      setPagination: 'audits/setPagination'
    }),
    onChange () {
      this.isLoad = true
      this.isOpen = true
      this.isDownloaded = false

      const str = this.setQueryToStr({ ...this.filtersStore })
      const url = str ? '/audit?search=' + str : '/audit'
      const params = {
        page: (this.paginationStore.page > 0 ? this.paginationStore.page - 1 : this.paginationStore.page),
        size: this.paginationStore.size
      }
      this.$axios.$get(url, { params })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.audits || []
          this.setPagination({ ...res?.page })
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
    requestStatusColor (status) {
      switch (status) {
        case 200:
        case 201:
        case 204:
          return 'green'

        default:
          return 'red'
      }
    }
  }
}
</script>

<style>

</style>
