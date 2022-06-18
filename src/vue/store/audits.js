const getDefaultFilters = () => {
  return {}
}

const getDefaultState = () => {
  return {
    filters: getDefaultFilters(),
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
  setFilters (state, payload) {
    state.filters = payload
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
export const actions = {
  async sendRequest (_, payload) {
    try {
      await this.$axios.$post('/audit', payload)
    } catch (error) {
      console.log(error)
    }
  }
}

// Getters
export const getters = {
  filters: s => s.filters || {},
  defaultFilters: () => getDefaultFilters(),
  pagination: s => s.pagination || {}
}
