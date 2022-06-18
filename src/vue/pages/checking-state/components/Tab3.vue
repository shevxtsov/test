<template>
  <div class="tabs__content tab3 pt3 pb3">
    <!-- Alert -->
    <BaseAlert
      v-if="rows && !rows.length && !isDownloaded"
      class="yellow m2"
      :text="$t('AlertEmpty')"
    />

    <!-- Table -->
    <div ref="chart" class="tab3__chart" />

    <!-- Alert -->
    <BaseAlert
      v-if="rows && !rows.length && isDownloaded"
      class="yellow m2"
      :text="$t('AlertNotFound')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'

export default {
  name: 'CheckingStateTab3',

  data: () => ({
    rows: [],
    option: {
      color: ['#b6010e', '#333333'],
      legend: {
        data: ['Задания', 'Результаты'],
        inactiveColor: '#777'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'cross',
          lineStyle: {
            color: '#376df4',
            width: 2,
            opacity: 1
          }
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLine: { lineStyle: { color: '#8392A5' } }
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: '#8392A5' } },
        splitLine: { show: false }
      },
      grid: {
        bottom: 80
      },
      dataZoom: [
        {
          textStyle: {
            color: '#8392A5'
          },
          handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          dataBackground: {
            areaStyle: {
              color: '#8392A5'
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5'
            }
          },
          brushSelect: true
        },
        {
          type: 'inside'
        }
      ],
      series: [
        {
          name: 'Задания',
          type: 'line',
          data: [],
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'Результаты',
          type: 'line',
          data: [],
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        }
      ]
    }
  }),

  computed: {
    ...mapGetters({
      filtersStore: 'checking-state/filters'
    }),
    cols () {
      return [
        {
          key: 'date',
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
        {
          key: 'resultQuantity',
          show: true
        },
        {
          key: 'missionQuantity',
          show: true
        }
      ]
    }
  },

  watch: {
    rows: {
      deep: true,
      immediate: true,
      handler () {
        this.initChart()
      }
    }
  },

  mounted () {
    this.onChange()
  },

  methods: {
    onChange () {
      this.$emit('isload', true)
      this.isDownloaded = false

      const str = this.setQueryToStr({ ...this.filtersStore })
      const params = {
        page: 0,
        size: 99999
      }
      if (str) {
        params.search = str
      }
      this.$axios.$get('/monitoring/interception-journal', {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.rows = res?._embedded?.interceptionJournalEntities || []
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
    },
    initChart () {
      if (this.$refs.chart && this.rows?.length) {
        this.option.series[0].data = this.rows.map(item => item.resultQuantity) || []
        this.option.series[1].data = this.rows.map(item => item.missionQuantity) || []
        this.option.xAxis.data = this.rows.map(item => item.date) || []

        const myChart = echarts.init(this.$refs.chart)
        this.option && myChart.setOption(this.option)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab3 {
  &__chart {
    height: 400px;
  }
}
</style>
