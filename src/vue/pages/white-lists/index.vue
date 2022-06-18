<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedId"
      @curAction="setCurrentTab"
    />
    <!-- :has-add="auth.roles[0].name === 'admin'"
      :has-edit="auth.roles[0].name === 'admin'"
      :has-delete="auth.roles[0].name === 'admin'" -->

    <!-- Body -->
    <div class="wrapper grid">
      <!-- Content -->
      <div class="content">
        <!-- Form -->
        <component
          :is="currentComponent"
          v-if="currentComponent && curAction !== 'View'"
          :ref="curAction + '-id'"
          class="mb2"
          :rows="rows"
          :selected-id.sync="selectedId"
          @updateList="onChange"
        />

        <!-- Response -->
        <BaseSlider
          v-model="isOpenResult"
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
              store="white-lists"
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
  name: 'WhiteLists',
  mixins: [pageMixins],

  data: () => ({
    rows: [],
    isOpenResult: true
  }),

  head () {
    return {
      title: this.$t('WhiteLists')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_OBR', 'ROLE_SUPERVISOR']
  },

  computed: {
    ...mapGetters({
      paginationStore: 'white-lists/pagination'
    }),
    cols () {
      return [
        {
          key: 'identificationKind',
          show: true,
          formatter: (val) => {
            return this.$t(val) || '-'
          }
        },
        {
          key: 'name',
          show: true
        }
      ]
    }
  },

  mounted () {
    this.onChange()
  },

  methods: {
    ...mapMutations({
      setPagination: 'white-lists/setPagination'
    }),
    onChange () {
      this.isLoad = true
      this.isOpenResult = true
      this.isDownloaded = false

      const url = '/whiteLists'
      const params = {
        page: (this.paginationStore.page > 0 ? this.paginationStore.page - 1 : this.paginationStore.page),
        size: this.paginationStore.size
      }
      this.$axios.$get(url, {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.whiteLists || []
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
