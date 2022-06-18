<template>
  <div class="page flex aic jcc">
    <div class="content p3">
      <h1 class="title">
        <b>Запрос 1.15</b>
        <span> - {{ $t('PasswordChangeTitle') }}</span>
      </h1>
      <form class="request box mb3 pch" @submit.prevent="sendAction">
        <div class="request__body grid ggap2 pl2 pr2 pt2 pb1">
          <FormItem
            v-model="getCurrentUser.userId"
            label="userId"
            type="text"
            name="userId"
            disabled
          />
          <FormItem
            v-model="formData.oldPassword"
            label="oldPassword"
            type="password"
            name="oldPassword"
            placeholder="******"
            autocomplete="new-password"
            required
          />
          <FormItem
            v-model="formData.newPassword"
            label="newPassword"
            type="password"
            name="newPassword"
            placeholder="******"
            autocomplete="new-password"
            required
          />
          <FormItem
            v-model="formData.rePassword"
            label="rePassword"
            type="password"
            name="rePassword"
            placeholder="******"
            autocomplete="new-password"
            required
          />
        </div>
        <hr>
        <div class="request__foot pl2 pr2 pt1 pb2">
          <button class="btn btn-primary w100" type="submit">
            Отправить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordChange',

  data: () => ({
    rePassword: '',
    formData: {
      userId: null,
      oldPassword: '',
      newPassword: ''
    }
  }),

  head () {
    return {
      title: this.$t('PasswordChange')
    }
  },

  computed: {
    auth () {
      return this.$store.getters.auth
    },
    getCurrentUser () {
      return this.$store.getters.auth
    },
    isValid () {
      let res = true
      if (this.formData.newPassword.length && this.rePassword.length) {
        res = this.formData.newPassword === this.rePassword
      }
      return res
    },
    isEmpty () {
      return !(this.formData.newPassword.length && this.formData.oldPassword.length && this.rePassword.length)
    }
  },

  mounted () {
    this.formData.userId = this.getCurrentUser.userId
  },

  methods: {
    sendAction () {
      this.isLoad = true

      if (this.formData.newPassword === this.formData.rePassword) {
        this.cleanErrors()
        const formData = { ...this.formData }
        delete formData.rePassword
        this.$axios.$patch('/users/changePassword', { ...formData }, {
          params: {
            url: 'ChangePassword'
          },
          headers: {
            Authorization: true
          }
        })
          .then(() => {
            this.$bus.$emit('setToast', {
              title: 'SUCCESS',
              message: 'password_change_success',
              class: 'green'
            })
            setTimeout(() => {
              this.logout()
            }, 4000)
          })
          .catch(() => {
            this.setErrors({ oldPassword: 'wrong' })
            this.$bus.$emit('setToast', {
              title: 'ERROR',
              message: 'wrong_password',
              class: 'red'
            })
          })
          .finally(() => {
            this.isLoad = false
          })
      } else {
        this.setErrors({ rePassword: 'wrong', newPassword: 'wrong' })
        this.$bus.$emit('setToast', {
          title: 'ERROR',
          message: 'password_not_valid',
          class: 'red'
        })
      }
    },

    logout () {
      this.$store.commit('resetState')
      this.$router.push('/')
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.pch {
  width: 350px;
}
</style>
