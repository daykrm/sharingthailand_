<template>
  <div>
    I AM ADMIN
    <v-btn @click="logout">Logout</v-btn>
  </div>
</template>
<script>
export default {
  middleware: ['isNotAuth', 'isAdmin'],
  methods: {
    logout() {
      this.$cookies.remove('isAdmin')
      this.$router.push({ path: '/login' })
    },
  },
}
</script>
