<template>
  <table class="table" cellspacing="0" cellpadding="0">
    <!-- Head -->
    <thead class="table__head">
      <template v-for="col of cols">
        <th v-if="col.show" :key="col.key" class="table__cell">
          <slot name="thead" :col="col">
            {{ $t(col.key) }}
          </slot>
        </th>
      </template>
    </thead>

    <!-- Body -->
    <tbody class="table__body">
      <tr
        v-for="(row, index) of rows"
        :key="row.id"
        class="table__row"
        :class="{ 'hasSelect' : isSelected, 'active' : selected === row.id }"
        @click="clickAction(row.id)"
        @dblclick="dblClickAction(row.id)"
      >
        <template v-for="col of cols">
          <td v-if="col.show" :key="col.key" class="table__cell">
            <slot :name="col.key" :cell="row[col.key]" :row="row" :index="index">
              <div v-if="!notMax" class="table__cell-max">
                {{ col.formatter ? col.formatter(row[col.key]) : (row[col.key] || '-') }}
              </div>
              <template v-else>
                {{ col.formatter ? col.formatter(row[col.key]) : (row[col.key] || '-') }}
              </template>
            </slot>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'BaseTable',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: {
      type: Number,
      default: 0
    },
    cols: {
      type: Array,
      default: () => []
    },
    rows: {
      type: Array,
      default: () => []
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    notMax: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    selected: {
      get () { return this.value },
      set (val) { this.$emit('change', val) }
    }
  },

  methods: {
    clickAction (id) {
      if (this.isSelected) {
        if (this.selected === id) {
          this.selected = 0
        } else {
          this.selected = id
        }
      } else {
        this.selected = 0
      }
    },
    dblClickAction (id) {
      if (this.isSelected) {
        this.selected = id
        this.$emit('dblClicked', id)
      } else {
        this.selected = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  border-bottom: $b1;
  width: 100%;
  min-width: max-content;

  &__cell {
    padding: 8px 15px;
    text-align: left;
  }

  &__head {
    .table__cell {
      font-weight: normal;
      font-size: 12px;
      color: #777;
      border-right: $b1;
      min-width: 150px;

      &:first-child {
        min-width: auto;
      }

      &:last-child {
        border-right: 0;
      }
    }
  }

  &__body {
    .table__row {
      &:hover {
        background-color: $grey-light;
      }

      &.hasSelect {
        cursor: pointer;
        user-select: none;
      }

      &.active {
        background-color: $primary-extra-light;
        color: $primary;
      }
    }

    .table__cell {
      border-right: $b1;
      border-top: $b1;
      max-width: 450px;

      &:last-child {
        border-right: 0;
      }

      &-max {
        max-width: 220px;
        text-overflow: ellipsis;
        display: block;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
