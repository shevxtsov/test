const getDefaultState = () => {
  return {
    folders: [],
    organizations: [],
    roles: [],
    trafficKinds: [],
    // informationFeature: [],
    communicationObjects: [],
    missionStates: [
      {
        key: 'MissionStatesnew',
        val: 'new'
      },
      {
        key: 'MissionStatespreparing',
        val: 'preparing'
      },
      {
        key: 'MissionStatessent_to_sorm',
        val: 'sent_to_sorm'
      },
      {
        key: 'MissionStateswork',
        val: 'work'
      },
      {
        key: 'MissionStatescomplete',
        val: 'complete'
      },
      {
        key: 'MissionStatesdelete',
        val: 'delete'
      },
      {
        key: 'MissionStateserror',
        val: 'error'
      }
    ]
  }
}

// State
export const state = () => getDefaultState()

// Mutations
export const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setFolders (state, payload) {
    state.folders = payload
  },
  setOrganizations (state, payload) {
    state.organizations = payload
  },
  setRoles (state, payload) {
    state.roles = payload
  },
  setTrafficKinds (state, payload) {
    state.trafficKinds = payload?._embedded?.trafficKinds.filter(item => item.code !== 'messenger' && item.code !== 'msn' && item.code !== 'radius')
  },
  setidentificationKind (state, payload) {
    state.identificationKind = payload
  },
  setCommunicationObjects (state, payload) {
    state.communicationObjects = payload
  }
  // setInformationFeature (state, payload) {
  //   state.informationFeature = payload
  // }
}

// Actions
export const actions = {
  async getFolders ({ commit }) {
    try {
      const params = { page: 0, size: 99999 }
      const res = await this.$axios.$get('/folders', { params })
      commit('setFolders', res)
    } catch (error) {
      console.log(error)
    }
  },
  async getOrganizations ({ commit }) {
    try {
      const res = await this.$axios.$get('/organizations')
      commit('setOrganizations', res)
    } catch (error) {
      console.log(error)
    }
  },
  async getRoles ({ commit }) {
    try {
      const res = await this.$axios.$get('/roles')
      commit('setRoles', res)
    } catch (error) {
      console.log(error)
    }
  },
  async getTrafficKinds ({ commit }) {
    try {
      const res = await this.$axios.$get('/trafficKind')
      commit('setTrafficKinds', res)
    } catch (error) {
      console.log(error)
    }
  },
  async getidentificationKind ({ commit }) {
    try {
      const res = await this.$axios.$get('/identificationKind')
      commit('setidentificationKind', res)
    } catch (error) {
      console.log(error)
    }
  },
  async getCommunicationObjects ({ commit }) {
    try {
      const res = await this.$axios.$get('/communicationObjects')
      commit('setCommunicationObjects', res)
    } catch (error) {
      console.log(error)
    }
  }
  // async getInformationFeature ({ commit }) {
  //   try {
  //     const res = await this.$axios.$get('/communicationObjects')
  //     commit('setInformationFeature', res)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

// Getters
export const getters = {
  folders: s => s.folders?._embedded?.folders,
  organizations: s => s.organizations?._embedded?.organizations,
  roles: s => s.roles?._embedded?.roles,
  missionStates: s => s.missionStates,
  trafficKinds: s => s.trafficKinds,
  identificationKind: s => s.identificationKind,
  communicationObjects: s => s.communicationObjects?._embedded?.communicationObjects
}
