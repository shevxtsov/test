const getDefaultState = () => {
  return {
    pagination: {
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0
    }
  }
}

// State
export const state = () => getDefaultState()

// Mutations
export const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setPagination (state, payload) {
    state.pagination = {
      page: (payload.number + 1),
      size: payload.size,
      totalElements: payload.totalElements,
      totalPages: payload.totalPages
    }
  },
  setPage (state, payload) {
    state.pagination.page = payload
  },
  setSize (state, payload) {
    state.pagination.size = payload
  }
}

// Actions
export const actions = {}

// Getters
export const getters = {
  pagination: s => s.pagination || {}
}

// // State
// export const state = () => ({
//   list: null
// })

// // Mutations
// export const mutations = {
//   setList (state, payload) {
//     state.list = payload
//   }
// }

// // Actions
// export const actions = {
//   async getList ({ commit }) {
//     const res = await this.$axios.$get('/folders')
//     commit('setList', res)
//   },

//   async addItem ({ commit }, payload) {
//     try {
//       const res = await this.$axios.$post('/folders', payload)
//       commit('setList', res)
//       commit(
//         'setError',
//         {
//           status: 200,
//           data: { error: 'Успех', message: 'Запись успешно созданна!' }
//         },
//         { root: true }
//       )
//     } catch (error) {
//       commit('setError', error.response, { root: true })
//     }
//   },

//   async updateItem ({ commit }, payload) {
//     try {
//       await this.$axios.$put(`/folders/${payload.id}`, payload)
//       commit(
//         'setError',
//         {
//           status: 200,
//           data: { error: 'Успех', message: 'Запись успешно обнавлена!' }
//         },
//         { root: true }
//       )
//     } catch (error) {
//       commit('setError', error.response, { root: true })
//     }
//   }
// }

// // Getters
// export const getters = {
//   list: s => s.list,
//   recursiveFolderOptions: (s) => {
//     const res = {}
//     const dataTree = {
//       parentFolder: '',
//       name: '',
//       subFolder: s.list?._embedded?.folders || []
//     }
//     bfs(dataTree.parentFolder, dataTree, 'subFolder', res, dataTree.name)
//     return Object.values(res).map(value => ({
//       ...value,
//       name: value.name.substr(2)
//     }))
//   },
//   foldersWithParentId: (s) => {
//     const dataTree = {
//       parentFolder: '',
//       subFolder: JSON.parse(JSON.stringify(s.list))?._embedded?.folders
//     }
//     transformFoldersWithParentId(dataTree, 'subFolder', dataTree.parentFolder)
//     return dataTree
//   }
// }

// const transformFoldersWithParentId = (tree, key, parentId) => {
//   tree[key]?.forEach((item) => {
//     item.parentFolder = parentId
//     if (Array.isArray(item[key]) && item[key].length) {
//       transformFoldersWithParentId(item, key, item.id)
//     }
//     return tree
//   })
// }

// const bfs = (parentId, tree, key, collection, name) => {
//   if (!tree[key] || tree[key].length === 0) {
//     return
//   }
//   tree[key]?.forEach((item) => {
//     const fullPath = (name + ' / ' + item.name).trim()
//     const newFolderObj = { ...item, parentFolder: parentId, name: fullPath }
//     // delete newFolderObj.subFolder
//     collection[item.id] = newFolderObj
//     bfs(newFolderObj.id, item, key, collection, fullPath)
//   })
// }
