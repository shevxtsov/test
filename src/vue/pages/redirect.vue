<template>
  <div />
</template>

<script>
export default {
  name: 'Redirect',

  mounted () {
    let path = ''
    switch (this.auth?.roles[0]?.name) {
      case 'ROLE_ADMIN':
        path = '/users'
        break
      case 'ROLE_ADMIN_MISSION':
        path = '/missions'
        break
      case 'ROLE_ADMIN_HARDWARE':
        path = '/checking-state'
        break
      case 'ROLE_OBR':
        path = '/missions'
        break
      case 'ROLE_ADMIN_OBR':
        path = '/users'
        break
      case 'ROLE_SUPERVISOR':
        path = '/users'
        break
      case 'ROLE_USER':
        path = '/users'
        break
      default:
        path = '/'
        break
    }
    try {
      this.$router.replace({ path })
    } catch (e) {
      console.log('NOOOOOO', e)
    }
  }
}
</script>

<style></style>
