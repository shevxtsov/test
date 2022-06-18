import moment from 'moment'

export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
    config.headers.common['X-Auth-Token'] = store.state.token
  })

  // Url without params
  function getIDfromUrl (url) {
    const index = url.indexOf('?')
    const len = url.length
    const result = index !== -1 ? url.substring(1, index) : url.substring(1, len)
    const indexSplash = result.indexOf('/')
    return result.includes('/') ? result.substring(indexSplash) : ''
  }

  // Url without params
  function getUrl (url) {
    const index = url.indexOf('?')
    const len = url.length
    const result = index !== -1 ? url.substring(1, index) : url.substring(1, len)
    const indexSplash = result.indexOf('/')
    return result.includes('/') ? result.substring(0, indexSplash) : result
  }

  // Set to audit new row
  function setAuditsData (res) {
    if (res?.config?.headers?.Authorization === true) {
      const body = res?.config?.data || null
      const parametrs = {
        id: getIDfromUrl(res?.config?.url),
        params: {
          ...res?.config?.params,
          ...(body && typeof body !== 'object' ? JSON.parse(body) : body)
        }
      }
      if (res.status > 204) {
        parametrs.params.error = res?.data?.error
        parametrs.params.message = res?.data?.message
      }
      const payload = {
        ip: store.getters.ip,
        username: store?.getters.auth?.userId || res?.config?.params?.username,
        requestMethod: res?.config?.method,
        requestUrl: res?.config?.params?.url || getUrl(res?.config?.url),
        requestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        requestStatus: res.status,
        requestParameters: JSON.stringify({ ...parametrs })
      }
      store.dispatch('audits/sendRequest', payload)
    }
  }

  // Intercept response
  $axios.interceptors.response.use(
    function (response) {
      setAuditsData(response)
      return response
    },
    function (error) {
      setAuditsData(error.response)
      return Promise.reject(error)
    })
}
