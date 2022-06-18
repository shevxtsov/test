<template>
  <div class="page grid gtrauto1">
    <BaseToolbar
      :active="curAction"
      :selected-item="getSelectedIdRecursive"
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
          :is-foot="false"
        >
          <template #body>
            <!-- Alert -->
            <BaseAlert
              v-if="rows && !rows.length && !isDownloaded"
              class="yellow m2"
              :text="$t('AlertEmpty')"
            />

            <!-- Table -->
            <div v-if="rows && rows.length" class="pl1 pt2 pb2 pr2">
              <ul class="tree">
                <FolderbarSingleTreeItem
                  v-for="item of rows"
                  :key="item.id"
                  v-model="selectedId"
                  :item="item"
                  color="white"
                />
              </ul>
            </div>

            <!-- Alert -->
            <BaseAlert
              v-if="rows && !rows.length && isDownloaded"
              class="yellow m2"
              :text="$t('AlertNotFound')"
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
  name: 'Folders',
  mixins: [pageMixins],
  provide () {
    return {
      multiselect: false
    }
  },

  data: () => ({
    rows: [],
    selectedFolders: null,
    isOpenResult: true
  }),

  head () {
    return {
      title: this.$t('Folders')
    }
  },
  meta: {
    role: ['ROLE_ADMIN', 'ROLE_ADMIN_OBR', 'ROLE_SUPERVISOR', 'ROLE_ADMIN_MISSION']
  },

  computed: {
    ...mapGetters({
      paginationStore: 'folders/pagination'
    }),
    cols () {
      return [
        {
          key: 'kind',
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
      setPagination: 'folders/setPagination'
    }),
    onChange () {
      this.isLoad = true
      this.isOpenResult = true
      this.isDownloaded = false

      const url = '/folders'
      const params = {
        page: 0,
        size: 99999
      }
      this.$axios.$get(url, {
        params,
        headers: {
          Authorization: this.$store.getters.isAudits
        }
      })
        .then((res) => {
          this.selectedId = 0
          this.rows = res?._embedded?.folders || []
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

<style lang="scss" scoped>
.tree {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-gap: 5px;
  background-image: url('~/static/img/folder-vline.svg');
  background-position: left top;
  background-repeat: repeat-y;
  position: relative;
}
</style>
