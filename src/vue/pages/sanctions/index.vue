<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      :has-edit="false"
      :has-renew="true"
      @curAction="setCurrentTab"
    />
    <!-- :has-add="auth.roles[0].name === 'admin'"
      :has-edit="auth.roles[0].name === 'admin'"
      :has-delete="auth.roles[0].name === 'admin'" -->

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
              <!-- :is-selected="auth.roles[0].name !== 'observer'" -->
              <template #stateAccess="{ cell }">
                <span class="marker" :class="cell === 'DISABLE' ? 'red' : 'green'">
                  {{ cell === 'DISABLE' ? $t('StatusBlocked') : $t('StatusNotBlock') }}
                </span>
              </template>
              <template #deletedSign="{ cell }">
                <span class="marker" :class="cell ? 'red' : 'green'">
                  {{ cell ? $t('StatusDeleted') : $t('StatusNotDeleted') }}
                </span>
              </template>
              <template #folders="{ cell }">
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
              store="sanctions"
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
  name: 'Users',
  mixins: [pageMixins],

  data: () => ({
    rows: [],
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('Sanctions')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_OBR', 'ROLE_SUPERVISOR']
  },

  computed: {
    ...mapGetters({
      filtersStore: 'sanctions/filters',
      paginationStore: 'sanctions/pagination'
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
          key: 'user',
          show: true,
          formatter: (val) => {
            return val?.userId || '-'
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
          key: 'mission',
          show: true,
          formatter: (val) => {
            return val?.number || '-'
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
      setPagination: 'sanctions/setPagination'
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
      this.$axios.$get('/sanctions', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.sanctions || []
          this.setPagination({ ...res?.page })
        })
        .catch((error) => {
          this.rows = []
          this.$bus.$emit('setToast', {
            title: 'Ошибка',
            message: error.response.data.status + ' - ' + error.response.data.error,
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
