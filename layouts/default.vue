<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in MenuItems"
          :key="i"
          :to="item.to"
          router
          exact
          @click="menuActionClick(item.action)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name:'DefaultTemplate',
  mounted() {
    this.checkAdmin()
  },
  data() {
    return {
      isAdmin: null,
      clipped: false,
      drawer: false,
      fixed: false,
      MenuItems: [],
      AdminItems: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Admin Dashboard',
          to: '/Admin',
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          action: 'logout',
          //to: '/',
        },
      ],
      UserItems: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Dashboard',
          to: '/User',
        },
        {
          icon: 'mdi-office-building-outline',
          title: 'ตั้งค่าข้อมูลบริษัท',
          to: '/User/Company',
        },
        {
          icon: 'mdi-account-plus-outline',
          title: 'ตั้งค่าพนักงาน',
          to: '/User',
        },
        {
          icon: 'mdi-cog-outline',
          title: 'ตั้งค่าบัญชีผู้ใช้',
          to: '/User',
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          action: 'logout',
          //to: '/',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    checkAdmin() {
      this.isAdmin = this.$cookies.get('isAdmin')
      if (this.isAdmin == 1) {
        this.MenuItems = this.AdminItems
      } else {
        this.MenuItems = this.UserItems
      }
    },
    logout() {
      this.$cookies.remove('isAdmin')
      this.$router.push({ path: '/login' })
    },
    menuActionClick(action) {
      if (action == 'logout') {
        this.logout()
      }
    },
  },
}
</script>
<style>
  
</style>
