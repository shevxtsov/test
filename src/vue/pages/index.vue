<template>
  <div class="page">
    <div class="flex aic jcc mb2">
      <BaseLogo big />
    </div>

    <FormBase
      class="has-body min"
      foot-class="grid gtc1"
      :has-cancel="false"
      @sendAction="sendAction()"
    >
      <template #body>
        <!-- Alert -->
        <BaseLoad
          v-if="isLoad"
          class="white-transparent"
        />
        <BaseAlert
          v-if="error"
          class="red"
          :text="errorTranslate"
        />

        <!-- Form -->
        <FormItem
          v-model="formData.username"
          label="userId"
          type="text"
          name="username"
          required
        />
        <FormItem
          v-model="formData.password"
          label="password"
          type="password"
          name="password"
          required
        />
      </template>
    </FormBase>
    <BaseLang class="lang" />
    <span class="bottom-title">
      ТОО «Wisk Telecom Solutions»
    </span>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'auth',

  data: () => ({
    formData: {
      username: '',
      password: ''
    },
    changePass: {
      userId: null,
      oldPassword: '',
      newPassword: '',
      reNewPassword: ''
    },
    currentTab: 'login',
    error: null,
    errorTranslate: ''
  }),

  watch: {
    formData: {
      handler () {
        this.error = null
      },
      deep: true
    }
  },

  mounted () {
    if (this.$store.getters.auth) {
      this.$router.push('/redirect')
    }
  },

  methods: {
    sendAction () {
      this.error = null
      this.isLoad = true
      this.$store.dispatch('getToken', this.formData)
        .then(() => {
          // this.checkUser()
          this.redirectUser()
        })
        .catch((e) => {
          this.setErrorMessage(e)
        })
        .finally(() => {
          this.isLoad = false
        })
    },
    checkUser () {
      // this.$axios.$get('/users/checkExpired/' + this.formData.username)
      //   .then(() => {
      //     this.redirectUser()
      //   })
      //   .catch((e) => {
      //     this.setErrorMessage(e.response.data)
      //   })
    },
    redirectUser () {
      this.$axios.$get(`/users/${this.formData.username}`)
        .then((currentUser) => {
          if (currentUser) {
            // Set user data
            this.$store.commit('setAuth', currentUser)
            localStorage.setItem(this.$store.getters.prefix + '_currentUser', JSON.stringify(currentUser))

            // Redirect
            this.$router.push('/redirect')
            setTimeout(() => {
              this.setToAudits()
            }, 1000)
          } else {
            this.error = true
          }
        })
    },
    setToAudits () {
      this.$axios.$get(`/users/${this.formData.username}`, {
        params: {
          url: 'Signin',
          username: this.formData.username
        },
        headers: {
          Authorization: true
        }
      })
    },
    // setErrorMessage (e) {
    //   console.log(e.message)
    //   switch (e.status) {
    //     case 401:
    //       this.error = {
    //         code: 401,
    //         message: 'Не правильный логин или пароль'
    //       }
    //       break

    //     case 404:
    //       this.error = { code: 404, message: 'Пользователь не найден' }

    //       break

    //     case 307:
    //       this.error = {
    //         code: 307,
    //         message: 'Ваш пароль устарел, смените пароль'
    //       }
    //       this.currentTab = 'change-password'
    //       this.changePass.userId = this.formData.username
    //       break

    //     case 409:
    //       this.error = { code: 409, message: '' }
    //       if (e.message === 'UserId time of action is not started.') {
    //         this.error.message = 'Учетная запись еще не активна'
    //       } else if (e.message === 'UserId is expired.' || e.message === 'user_is_expired') {
    //         this.error.message = 'Истек срок действия учетной записи, обратитесь к администратору.'
    //       } else if (e.message === 'Password time of action is not started.') {
    //         this.error.message = 'Срок действия пароля еще не активен'
    //       }
    //       break

    //     default:
    //       this.error = {
    //         code: 401,
    //         message: 'Не правильный логин или пароль'
    //       }
    //       break
    //   }
    // },

    setErrorMessage (e) {
      this.error = true
      if (e.message === 'Bad credentials') {
        e.message = 'Ошибка 401!'
      } else if (e.message === 'User not found!') {
        e.message = 'Пользователь не найден'
      } else if (e.message === 'User is blocked!') {
        e.message = 'Пользователь заблокирован'
      } else if (e.message === 'Wrong name or password!') {
        e.message = 'Неправильное имя или пароль'
      } else if (e.message === 'User is has wrong IPAddress!') {
        e.message = 'Пользователь имеет неправильный IP-адрес!'
      } else if (e.message === 'User not started!') {
        e.message = 'Пользователь не запущен!'
      } else if (e.message === 'User is expired!') {
        e.message = 'Срок действия пользователя истек!'
      } else if (e.message === 'Password not started!') {
        e.message = 'Пароль не запущен!'
      } else if (e.message === 'Password is expired!') {
        e.message = 'Срок действия пароля истек!'
      } else if (e.message === 'Maximum sessions of 1 for this principal exceeded') {
        e.message = 'Превышено максимальное количество сеансов (1) для этого принципала.'
      } else { e.message = 'Ошибка!' }
      this.errorTranslate = e.message
      console.log(this.error)
      return this.errorTranslate

      // case 2:
      //   if (e.message === 'User is blocked!') { this.error.message = 'Пользователь заблокирован' }
      //   break
      // case 3:
      //   if (e.message === 'Wrong name or password!') { this.error.message = 'Не правильный логин или пароль' }
      //   break
      // case 4:
      //   if (e.message === 'Wrong name or password!') { this.error.message = 'Не правильный логин или пароль' }
      //   break
    }

  },
  async changePassword () {
    const payload = {
      ...this.changePass
    }
    delete payload.reNewPassword
    const res = await this.$store.dispatch('users/passwordChange', { payload, params: { isExpired: true } })
    if (res) {
      this.error = null
      this.formData.password = this.changePass.newPassword
      this.signIn()
    } else {
      this.error = { code: 406, message: 'Старый пароль не правильный!' }
    }
  }
}

</script>

<style lang="scss" >
.bottom-title{
      position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    color: #a5a5a5;
    font-size: 13px;
    padding: 15px 0;
}
.lang {
  margin-top: 10px;
  display: flex;
 justify-content: flex-end;
}
</style>
