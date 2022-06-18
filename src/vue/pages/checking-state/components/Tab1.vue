<template>
  <div class="tabs__content tab1">
    <!-- Alert -->
    <BaseAlert
      v-if="rows && !rows.length && !isDownloaded"
      class="yellow m2"
      :text="$t('AlertEmpty')"
    />

    <!-- Table -->
    <template v-if="rows && rows.length">
      <BaseTable
        v-model="selectedId"
        :is-selected="false"
        :cols="cols"
        :rows="rows"
      >
        <template #state="{ cell }">
          <svg :class="`ic-16 ic-${cell ? 'green' : 'red'} icon`">
            <use v-if="cell" xlink:href="~/static/img/icons.svg#check_circle" />
            <use v-else xlink:href="~/static/img/icons.svg#x_circle" />
          </svg>
        </template>
      </BaseTable>
      <BasePagination
        store="checking-state"
        class="p2"
        @onChange="onChange"
      />
    </template>

    <!-- Alert -->
    <BaseAlert
      v-if="rows && !rows.length && isDownloaded"
      class="yellow m2"
      :text="$t('AlertNotFound')"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CheckingStateTab1',

  data: () => ({
    rows: []
  }),

  computed: {
    ...mapGetters({
      filtersStore: 'checking-state/filters',
      paginationStore: 'checking-state/pagination'
    }),
    cols () {
      return [
        {
          key: 'createdAt',
          show: true,
          formatter: (val) => {
            return this.formatDate(val)
          }
        },
        {
          key: 'communicationObject',
          show: true,
          formatter: (val) => {
            return val?.name ? val.name + ' - ' + val.ip : '-'
          }
        },
        // {
        //   key: 'ip',
        //   name: 'Содержание события',
        //   show: true
        // },
        {
          key: 'state',
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
      setPagination: 'checking-state/setPagination'
    }),
    onChange () {
      this.$emit('isload', true)
      this.isDownloaded = false

      const str = this.setQueryToStr({ ...this.filtersStore })
      const params = {
        page: (this.paginationStore.page > 0 ? this.paginationStore.page - 1 : this.paginationStore.page),
        size: this.paginationStore.size
      }
      if (str) {
        params.search = str
      }
      this.$axios.$get('/monitoring/hardware', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.hardwares || []
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
          this.$emit('isload', false)
          this.isDownloaded = true
        })
    }
  }
}
</script>
