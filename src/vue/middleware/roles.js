export default function ({ store, route, redirect }) {
  if (route?.meta[0]?.role?.length) {
    if (!route.meta[0].role.includes(store?.getters?.auth?.roles[0]?.name)) {
      return redirect('/redirect')
    }
  }
}
