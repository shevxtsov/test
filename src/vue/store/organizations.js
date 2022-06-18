const getDefaultState = () => {
  return {
    pagination: {
      page: 0,
      size: 20,
      total: 0
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
