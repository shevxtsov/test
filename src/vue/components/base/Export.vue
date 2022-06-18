<template>
  <div v-click-outside="() => { isOpen = false }" class="export ddown ddown-right">
    <button
      type="button"
      class="export__icon flex aic jcc p0"
      :class="{ 'active' : isOpen }"
      @click="isOpen = !isOpen"
    >
      <svg class="ic-18 ic-black">
        <use xlink:href="~/static/img/icons.svg#doc" />
      </svg>
    </button>

    <!-- Ddwon -->
    <div v-if="isOpen" class="ddown__body">
      <div class="export__head pl2 pr2 pt15 pb15">
        {{ $t('ExportFiles') }}
      </div>
      <div class="export__body grid">
        <BaseLoad v-if="isLoad" class="white-transparent" />
        <template v-else>
          <template v-if="rows && rows.length">
            <!-- Item -->
            <div
              v-for="item of rows"
              :key="item.id"
              class="export__item p1 grid gtcauto1auto ggap1 aic"
              :class="{ 'pending' : item < 2 }"
            >
              <!-- Item status -->
              <div class="export__item-status flex aic jcc">
                <img v-if="item.state === 'IN_PROCESS'" src="@/static/img/loading.svg">
                <svg v-else-if="item.state === 'SUCCESS'" class="ic-20 ic-green">
                  <use xlink:href="~/static/img/icons.svg#check_circle" />
                </svg>
                <svg v-else-if="item.state === 'FAILED'" class="ic-20 ic-red">
                  <use xlink:href="~/static/img/icons.svg#alert_triangle" />
                </svg>
              </div>
              <!-- Item text -->
              <div class="export__item-text pr2">
                <div class="flex aic ggap1 mb05">
                  <h3 class="m0 cut" :title="item.fileName">
                    {{ item.fileName }}
                  </h3>
                  <small v-if="item % 2 == 0" class="marker blue">FTP</small>
                  <small v-else class="marker green">Рабочий стол</small>
                </div>
                <small class="tsm">{{ formatDate(item.createdAt) }}</small>
              </div>
              <!-- Item actions -->
              <div class="export__item-btns grid gtc2 ggap1">
                <button class="btn btn-base" :disabled="item.state !== 'SUCCESS'" @click="downloadFile(item.fileName)">
                  <svg class="ic-18 ic-black">
                    <use xlink:href="~/static/img/icons.svg#download-sm" />
                  </svg>
                </button>
                <button class="btn btn-base" :disabled="item.state === 'IN_PROCESS'" @click="deleteFile(item.id)">
                  <svg class="ic-16 ic-black">
                    <use xlink:href="~/static/img/icons.svg#delete" />
                  </svg>
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <BaseAlert
              class="yellow m2"
              :text="$t('AlertNothingFound')"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseExport',

  data: () => ({
    rows: [],
    timer: null
  }),

  watch: {
    isOpen (val) {
      if (val) {
        this.getRows()
      }
    }
  },

  mounted () {
    this.$bus.$on('openExportList', () => {
      this.isOpen = true
    })
    this.timer = setInterval(() => {
      this.getRowsInterval()
    }, 5000)
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  methods: {
    getRows () {
      const user = this.$store?.getters?.auth?.userId
      if (user) {
        this.isLoad = true
        this.$axios.$get('/export?UserId=' + user)
          .then((res) => {
            this.rows = res.filter(item => item.deletedSign === false)
          })
          .catch((e) => {
            console.log(e)
          })
          .finally((e) => {
            this.isLoad = false
          })
      }
    },
    downloadFile (link) {
      this.isLoad = true
      this.$axios.$delete('http://localhost:8080/' + link)
        .then((res) => {
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
        .finally((e) => {
          this.isLoad = false
        })
    },
    deleteFile (id) {
      this.isLoad = true
      this.$axios.$delete('/export/' + id)
        .then(() => {
          this.getRows()
        })
        .catch((e) => {
          console.log(e)
        })
        .finally((e) => {
          this.isLoad = false
        })
    },
    getRowsInterval () {
      const user = this.$store?.getters?.auth?.userId
      if (user) {
        this.$axios.$get('/export?UserId=' + user)
          .then((res) => {
            this.rows = res.filter(item => item.deletedSign === false)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.export {
  height: 100%;

  &__icon {
    width: 40px;
    height: 100%;
    border: 0;
    border-left: $b1;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      background-color: $grey-light;
    }
    &.active {
      background-color: $grey;
    }
  }

  &__head {
    border-bottom: $b1;
  }

  &__body {
    overflow: auto;
    max-height: calc(100vh - 150px);
    width: 460px;
  }

  &__item {
    border-bottom: $b1;

    &.pending {
      background-color: $grey-light;
      color: #999;
      filter: grayscale(1);
    }

    &:hover {
      background-color: $grey-light;
    }

    &:last-child {
      border: 0;
    }

    &-status {
      width: 40px;

      img {
        width: 30px;
        height: 30px;
      }
    }

    &-text {
      h3 {
        max-width: 140px;
      }
    }
  }
}
</style>
