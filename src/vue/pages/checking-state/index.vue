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
          :is-foot="false"
        >
          <template #body>
            <div class="tabs">
              <div class="tabs__nav flex aic ggap2 pl15 pr15">
                <button :class="{ 'active' : currentTab === 1 }" @click="currentTab = 1">
                  {{ $t('CheckingStateTab1') }}
                </button>
                <button :class="{ 'active' : currentTab === 2 }" @click="currentTab = 2">
                  {{ $t('CheckingStateTab2') }}
                </button>
                <button :class="{ 'active' : currentTab === 3 }" @click="currentTab = 3">
                  {{ $t('CheckingStateTab3') }}
                </button>
              </div>

              <div class="tabs__content">
                <Tab1
                  v-if="currentTab === 1"
                  ref="tab1"
                  @isload="isLoad = $event"
                />
                <Tab2
                  v-if="currentTab === 2"
                  ref="tab2"
                  @isload="isLoad = $event"
                />
                <Tab3
                  v-if="currentTab === 3"
                  ref="tab3"
                  @isload="isLoad = $event"
                />
              </div>
            </div>
          </template>
        </BaseSlider>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Tab1 from './components/Tab1.vue'
import Tab2 from './components/Tab2.vue'
import Tab3 from './components/Tab3.vue'
import pageMixins from '@/plugins/mixins/page'

export default {
  name: 'Users',
  components: { Tab1, Tab2, Tab3 },
  mixins: [pageMixins],

  data: () => ({
    currentTab: 1,
    selectedFolders: []
  }),

  head () {
    return {
      title: this.$t('CheckingState')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_HARDWARE']
  },

  computed: {
    ...mapGetters({
      paginationStore: 'checking-state/pagination'
    }),
    page: {
      get () { return this.paginationStore.page },
      set (val) { this.setPage(val) }
    }
  },

  watch: {
    currentTab () {
      this.page = 0
    }
  },

  mounted () {
    this.onChange()
  },

  methods: {
    ...mapMutations({
      setPage: 'checking-state/setPage'
    }),
    onChange () {
      this.isLoad = true
      this.isOpen = true
      this.$refs['tab' + this.currentTab].onChange()
      this.isLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  &__nav {
    background-color: $grey-light;
    border-bottom: $b1;

    button {
      border: 0;
      padding: 0;
      background-color: transparent;
      height: 40px;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #000;
      }
      &.active {
        color: $primary;
        box-shadow: inset 0 -2px 0 0 $primary;
      }
    }
  }
}
</style>
