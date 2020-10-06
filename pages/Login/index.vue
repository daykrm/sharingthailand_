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
              <v-card-text>
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
                <v-btn color="primary" @click="userLogin">Login</v-btn>
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
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
      isAdmin: null,
      prefix: null,
    }
  },
  mounted() {
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      this.isAdmin = this.$cookies.get('isAdmin')
      if (this.isAdmin != null) {
        if (this.isAdmin) {
          this.$router.push({ path: '/admin' })
        } else {
          this.$router.push({ path: '/user' })
        }
      }
    },
    async userLogin() {
      const data = {
        func: 'login',
        username: this.login.username,
        password: this.login.password,
      }
      await axios.post('/api', data).then((res) => {
        if (res.data == 'success') {
          alert('ok')
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
  },
}
</script>
