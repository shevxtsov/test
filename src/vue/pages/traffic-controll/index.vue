<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      :has-edit="false"
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
            >
              <template #isStarted="{ cell }">
                <span class="marker" :class="cell ? 'green' : 'red'">
                  {{ cell ? $t('Intercept') : $t('NotIntercept') }}
                </span>
              </template>
              <template #mission="{ cell }">
                <span class="marker">
                  {{ cell && cell.number }}
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
              store="traffic-controll"
              class="p2"
              @onChange="onChange"
            />
          </template>
        </BaseSlider>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import pageMixins from '@/plugins/mixins/page'

export default {
  name: 'TrafficControll',
  mixins: [pageMixins],

  data: () => ({
    rows: [],
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('TrafficControll')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_OBR', 'ROLE_SUPERVISOR']
  },

  computed: {
    ...mapGetters({
      filtersStore: 'traffic-controll/filters',
      paginationStore: 'traffic-controll/pagination'
    }),
    cols () {
      return [
        {
          key: 'routerIp',
          show: true
        },
        {
          key: 'targetIp',
          show: true
        },
        {
          key: 'isStarted',
          show: true
        },
        {
          key: 'mission',
          show: true
        },
        {
          key: 'startScenario',
          show: true,
          formatter: (val) => {
            return val || '-'
          }
        },
        {
          key: 'stopScenario',
          show: true,
          formatter: (val) => {
            return val || '-'
          }
        },
        {
          key: 'startedAt',
          show: true,
          formatter: (val) => {
            return this.formatDate(val)
          }
        },
        {
          key: 'endedAt',
          show: true,
          formatter: (val) => {
            return this.formatDate(val)
          }
        }
      ]
    }
  },

  methods: {
    ...mapMutations({
      setPagination: 'traffic-controll/setPagination'
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
      this.$axios.$get('/trafficController', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.trafficControllers || []
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
    }
  }
}
</script>

<style>

</style>
