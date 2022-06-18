const getDefaultState = () => {
  return {
    prefix: 'sorm2',
    auth: null,
    token: null,
    timer: '',
    restartTimer: false,
    ip: '',
    isAudits: false
  }
}

// State
export const state = () => getDefaultState()

// Mutations
export const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
    localStorage.removeItem(state.prefix + '_token')
    localStorage.removeItem(state.prefix + '_currentUser')
  },
  setToken (state, payload) {
    state.token = payload
  },
  setAuth (state, payload) {
    state.auth = payload
  },
  setRestartTimerState (state, payload) {
    state.restartTimer = payload
  },
  setTimer (state, payload) {
    state.timer = payload
  },
  setIP (state, payload) {
    state.ip = payload
  },
  setAudits (state, payload) {
    state.isAudits = payload
  }
}

// Actions
export const actions = {
  nuxtClientInit ({ state, commit }) {
    // Reset token
    if (localStorage.getItem(state.prefix + '_token')) {
      try {
        const token = localStorage.getItem(state.prefix + '_token')
        commit('setToken', token)
      } catch (error) {
        localStorage.removeItem(state.prefix + '_token')
      }
    }
    // Reset user data
    if (localStorage.getItem(state.prefix + '_currentUser')) {
      try {
        const auth = JSON.parse(localStorage.getItem(state.prefix + '_currentUser'))
        commit('setAuth', auth)
      } catch (error) {
        localStorage.removeItem(state.prefix + '_currentUser')
      }
    }
  },
  getToken ({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/token', {
        headers: {
          authorization: 'Basic ' + btoa(payload.username + ':' + payload.password)
        }
      })
        .then(({ token }) => {
          localStorage.setItem(state.prefix + '_token', token)
          commit('setToken', token)
          resolve(true)
        })
        .catch((e) => {
          reject(e.response.data)
        })
    })
  },
  async refreshToken ({ state }) {
    if (state.auth) {
      return await this.$axios.$post('/refresh')
    }
  },
  getClientIP ({ commit }) {
    const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    const pc = new MyPeerConnection({
      iceServers: []
    })
    const noop = function () {}
    const localIPs = {}
    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

    function ipIterate (ip) {
      if (!localIPs[ip]) {
        commit('setIP', ip)
      }
      localIPs[ip] = true
    }
    pc.createDataChannel('')
    pc.createOffer(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (!line.includes('candidate')) { return }
        line.match(ipRegex).forEach(ipIterate)
      })
      pc.setLocalDescription(sdp, noop, noop)
    }, noop)
    pc.onicecandidate = function (ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) { return }
      ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
    }
  }
}

// Getters
export const getters = {
  restartTimer: s => s.restartTimer,
  token: s => s.token,
  prefix: s => s.prefix,
  timer: s => s.timer,
  auth: s => s.auth,
  ip: s => s.ip,
  isAudits: s => s.isAudits
}
