<template>
  <div class="pagination flex aic jcsb ggap3 pl15 pr15 pt1 pb1">
    <!-- Size -->
    <div class="pagination__left flex aic ggap1">
      <span class="cut">{{ $t("PageSize") }}:</span>
      <select
        id="size"
        v-model="size"
        name="size"
        @change="onChange()"
      >
        <option
          v-for="(item, index) in pageSizes"
          :key="index"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
    </div>

    <!-- Tatal elements -->
    <span>
      {{ $t('TotalElements') }}: <b>{{ paginationStore && paginationStore.totalElements }}</b>
    </span>

    <!-- Pages -->
    <div class="pagination__right flex aic ggap1">
      <!-- First -->
      <button
        class="pagination__btn flex aic jcc"
        :disabled="reachedMinLimit"
        @click="onChange('first')"
      >
        <svg class="ic-14 ic-black">
          <use xlink:href="@/static/img/icons.svg#arrow_first" />
        </svg>
      </button>

      <!-- Prev -->
      <button
        class="pagination__btn flex aic jcc"
        :disabled="reachedMinLimit"
        @click="onChange('prev')"
      >
        <svg class="ic-14 ic-black">
          <use xlink:href="@/static/img/icons.svg#arrow_prev" />
        </svg>
      </button>

      <!-- Set page number -->
      <div class="pagination__count flex aic ggap05 pl2 pr2">
        <input
          id="current-page"
          v-model.number="page"
          :max="paginationStore.totalPages"
          type="number"
          name="current-page"
          min="1"
          step="1"
          :disabled="paginationStore.totalPages < 1"
          @blur="blurHandler()"
          @input="inputHandler($event); searchHandler($event);"
        >
        <span>{{ $t('From') }} {{ paginationStore.totalPages }}</span>
      </div>

      <!-- Next -->
      <button
        class="pagination__btn flex aic jcc"
        :disabled="reachedMaxLimit"
        @click="onChange('next')"
      >
        <svg class="ic-14 ic-black">
          <use xlink:href="@/static/img/icons.svg#arrow_next" />
        </svg>
      </button>

      <!-- Last -->
      <button
        class="pagination__btn flex aic jcc"
        :disabled="reachedMaxLimit"
        @click="onChange('last')"
      >
        <svg class="ic-14 ic-black">
          <use xlink:href="@/static/img/icons.svg#arrow_last" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  name: 'BasePagination',

  props: {
    store: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    pageSizes: [20, 50, 100]
  }),

  computed: {
    paginationStore () {
      return this.$store.getters[this.store + '/pagination']
    },
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.$store.commit(this.store + '/setPage', val) }
    },
    size: {
      get () { return this.paginationStore.size },
      set (val) {
        if (this.page > 1) {
          this.page = 1
        }
        this.$store.commit(this.store + '/setSize', val)
      }
    },
    reachedMinLimit () {
      return this.page <= 1
    },
    reachedMaxLimit () {
      return this.page >= this.paginationStore?.totalPages
    }
  },

  methods: {
    blurHandler () {
      if (!this.page) {
        this.page = 1
        this.onChange('first')
      }
    },
    inputHandler (e) {
      if (!e.target.validity.valid) {
        if (!this.page) {
          this.page = 1
        }
        if (this.page > this.paginationStore.totalPages) {
          this.page = this.paginationStore.totalPages
        }
      }
    },
    searchHandler: debounce(function () {
      if (this.page >= 1 && this.page <= this.paginationStore.totalPages) {
        this.onChange()
      }
    }, 1000),
    onChange (key) {
      if (key) {
        switch (key) {
          case 'first':
            this.page = 1
            break

          case 'prev':
            --this.page
            break

          case 'next':
            ++this.page
            break

          case 'last':
            this.page = this.paginationStore.totalPages
            break

          default:
            this.page = 1
            break
        }
      }
      this.$store.commit('setAudits', false)
      this.$emit('onChange')
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  background-color: #fff;
  border-radius: 0 0 $br $br;

  &__left {
    select {
      width: auto;
    }
  }

  &__btn {
    border: $b1;
    background-color: #fff;
    padding: 0 10px;
    height: 30px;
    border-radius: $br;
    cursor: pointer;

    &:hover {
      background-color: $grey-light;
    }

    &:active {
      background-color: $grey;
    }

    &:disabled {
      background-color: $grey;
      border-color: $grey;
      cursor: not-allowed;

      & > svg {
        fill: #999;
      }
    }
  }

  &__count {
    input {
      font-weight: bold;
      padding: 2px;
      width: 40px;
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
}
</style>
