<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      :has-add="hideBtns"
      :has-edit="hideBtns"
      :has-delete="hideBtns"
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
            >
              <template #deletedSign="{ cell }">
                <span class="marker" :class="cell ? 'red' : 'green'">
                  {{ cell ? $t('StatusDeleted') : $t('StatusNotDeleted') }}
                </span>
              </template>
              <template #trafficKinds="{ cell }">
                <div v-if="cell && cell.length" class="flex fw aic ggap05">
                  <span v-for="item of cell" :key="item.id" class="marker">
                    {{ item.name }}
                  </span>&nbsp;
                </div>
                <template v-else>
                  -
                </template>
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
              store="missions"
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
  name: 'Missions',
  mixins: [pageMixins],

  data: () => ({
    rows: [],
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('Missions')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_OBR', 'ROLE_SUPERVISOR', 'ROLE_ADMIN_MISSION', 'ROLE_ADMIN_OBR']
  },

  computed: {
    ...mapGetters({
      filtersStore: 'missions/filters',
      paginationStore: 'missions/pagination'
    }),
    cols () {
      return [
        {
          key: 'organization',
          show: true,
          formatter: (val) => {
            return val?.name || '-'
          }
        },
        {
          key: 'number',
          show: true,
          formatter: (val) => {
            return val
          }
        },
        {
          key: 'folder',
          show: true,
          formatter: (val) => {
            return val?.name || '-'
          }
        },
        {
          key: 'targetAlias',
          show: true,
          formatter: (val) => {
            return val
          }
        },
        {
          key: 'targetId',
          show: true,
          formatter: (val) => {
            return val
          }
        },
        {
          key: 'communicationObject',
          show: true,
          formatter: (val) => {
            return val?.name + ' - ' + val?.ip || '-'
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
        },
        {
          key: 'trafficKinds',
          show: true
        },
        {
          key: 'processedSign',
          show: true,
          formatter: (val) => {
            return val ? this.$t('Processed') : this.$t('NotProcessed')
          }
        },
        {
          key: 'state',
          show: true,
          formatter: (val) => {
            return this.$t('MissionStates' + val?.name)
          }
        },
        {
          key: 'note',
          show: true,
          formatter: (val) => {
            return val
          }
        }
      ]
    },
    hideBtns () {
      const role = this.auth?.roles?.length && this.auth?.roles[0].name
      return role !== 'ROLE_SUPERVISOR' && role !== 'ROLE_ADMIN_OBR'
    }
  },

  methods: {
    ...mapMutations({
      setPagination: 'missions/setPagination'
    }),
    onChange () {
      this.isLoad = true
      this.isOpen = true
      this.isDownloaded = false

      const str = this.setQueryToStr({ ...this.filtersStore, deletedSign: false })
      const params = {
        page: (this.paginationStore.page > 0 ? this.paginationStore.page - 1 : this.paginationStore.page),
        size: this.paginationStore.size
      }
      if (str) {
        params.search = str
      }
      this.$axios.$get('/missions', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.missions || []
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
