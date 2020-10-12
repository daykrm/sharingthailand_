<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Sharing Thailand</v-toolbar-title>
              </v-toolbar>
              <v-card-text @keyup.enter="userLogin">
                <v-form>
                  <v-text-field
                    label="Username"
                    v-model="login.username"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    v-model="login.password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="checkLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginComponent',
  layout: 'login',
  middleware: ['isAuth'],
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
      isAdmin: null,
      prefix: [],
      db: window.location.hostname.toString().split('.')[0],
      isUser: null,
    }
  },
  mounted() {
    this.getPrefix()
  },
  methods: {
    getPrefix() {
      axios.get('/api/user').then((res) => {
        console.log(res.data)
        this.prefix = res.data
        res.data.forEach((val) => {
          if (val.prefix_db == this.db) {
            this.isUser = true
          } else {
            this.isUser = false
          }
        })
      })
    },
    adminLogin() {
      const data = {
        //func: 'login',
        username: this.login.username,
        password: this.login.password,
      }
      axios.post('/api/login', data).then((res) => {
        if (res.data.message == 'success') {
          this.$cookies.set('isAdmin', res.data.data, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.isAdmin = this.$cookies.get('isAdmin')
          if (this.isAdmin) {
            this.$router.push({ path: '/admin' })
          } else {
            this.$router.push({ path: '/user' })
          }
        } else {
          alert(res.data)
        }
      })
    },
    userLogin() {
      const data = {
        //func: 'login',
        username: this.login.username,
        password: this.login.password,
      }
      axios.post(`/api/login/${this.db}`, data).then((res) => {
        if (res.data.message == 'success') {
          this.$cookies.set('isAdmin', res.data.isAdmin, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.$cookies.set('user_status', res.data.status, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.$cookies.set('user_id', res.data.user_id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.isAdmin = this.$cookies.get('isAdmin')
          var status = this.$cookies.get('user_status')
          if (this.isAdmin) {
            this.$router.push({ path: '/Admin' })
          } else {
            if (status) {
              // 1 = Client
              this.$router.push({ path: '/user/company' })
            } else {
              // 0 = Marketing
              this.$router.push({ path: '/marketing' })
            }
          }
        } else {
          alert(res.data)
        }
      })
    },
    checkLogin() {
      if (this.isUser) {
        this.userLogin()
      } else {
        this.adminLogin()
      }
    },
  },
}
</script>
