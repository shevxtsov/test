<template>
  <header class="header flex aic pl3 pr3">
    <!-- Logo -->
    <nuxt-link to="/redirect" class="header__item logo flex aic mr2">
      <img src="@/static/img/logo.svg" alt="SORM-ORM">
    </nuxt-link>

    <!-- Navigate -->
    <nav v-if="nav" class="header__item nav flex aic">
      <!-- Nav links -->
      <template v-for="item of nav">
        <ItemLink
          v-if="!item.subList"
          :key="'link-' + item.id"
          :item="item"
        />
        <ItemSubLink
          v-else
          :key="'sublink-' + item.id"
          :item="item"
        />
      </template>

      <!-- More drop down -->
      <ItemSubMoreLink
        v-if="auth && auth.roles && auth.roles.length && auth.roles[0].name === 'ROLE_ADMIN'"
        :list="nav"
      />
    </nav>

    <!-- Right -->
    <div class="header__item mlauto right flex aic">
      <!-- Export -->
      <BaseExport v-if="auth && auth.roles.length && auth.roles[0].name === 'ROLE_OBR'" />

      <!-- Timer -->
      <BaseTimer
        class="right__item"
        @logout="logout"
      />

      <!-- Role -->
      <div class="right__item role pl1 pr1">
        <small class="tsm">{{ $t('AccessRights') }}:</small>
        <b>{{ userRole }}</b>
      </div>

      <!-- Lang -->
      <BaseLang class="right__item" />

      <!-- Logout -->
      <div class="right__item logout">
        <button class="logout__btn flex aic ggap1" @click="logout">
          <svg class="ic-14 ic-primary">
            <use xlink:href="~/static/img/icons.svg#logout" />
          </svg>
          {{ $t('Exit') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import menuAdmin from '@/assets/json/menu/Admin.js'
import menuAdminMission from '@/assets/json/menu/AdminMission.js'
import menuAdminHardware from '@/assets/json/menu/AdminHardware.js'
import menuAdminObr from '@/assets/json/menu/AdminObr.js'
import menuSupervisor from '@/assets/json/menu/Supervisor.js'
import menuObr from '@/assets/json/menu/Obr.js'

export default {
  name: 'BaseHead',

  computed: {
    nav () {
      if (this.auth?.roles?.length) {
        let roleName = ''
        for (let i = 0; i < this.auth.roles.length; i++) {
          const role = this.auth.roles[i]
          roleName = role.name
        }

        switch (roleName) {
          case 'ROLE_ADMIN':
            return menuAdmin.call(this)

          case 'ROLE_ADMIN_MISSION':
            return menuAdminMission.call(this)

          case 'ROLE_ADMIN_HARDWARE':
            return menuAdminHardware.call(this)

          case 'ROLE_OBR':
            return menuObr.call(this)

          case 'ROLE_ADMIN_OBR':
            return menuAdminObr.call(this)

          case 'ROLE_SUPERVISOR':
            return menuSupervisor.call(this)

          default:
            return menuAdmin.call(this)
        }
      }
      return null
    },
    userRole () {
      return this.auth?.roles?.length ? this.$t(this.auth?.roles[0]?.name) : 'Роль не задана'
    }
  },

  methods: {
    logout () {
      this.$axios.$get('/logout', {
        headers: {
          Authorization: true
        }
      })
        .finally(() => {
          this.$store.commit('resetState')
          this.$router.push('/')
          setTimeout(() => {
            window.location.reload()
          }, 300)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  border-bottom: $b1;
  position: relative;
  z-index: 9999;

  &__item {
    height: 100%;

    &.logo {
      width: auto;
      height: 25px;
    }

    .right {
      height: 100%;

      &__item {
        height: 100%;
        border-left: $b1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }
    }
  }

  .logout {
    &__btn {
      border: 0;
      background-color: transparent;
      color: $primary;
      height: 100%;
      padding: 0 15px;
      cursor: pointer;

      &:hover {
        background-color: $grey-light;
      }
      &:active {
        background-color: $grey;
      }
    }
  }
}

.nav {
  grid-gap: 1px;
  border-left: $b1;
  height: 100%;

  @media screen and (min-width: 1990px) {
    .more {
      display: none !important;
    }
  }
}
</style>
