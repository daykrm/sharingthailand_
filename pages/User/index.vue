<template>
  <div>Dashboard</div>
</template>
<script>
import axios from 'axios'
export default {
  middleware: ['isNotAuth'],
  data() {
    return {
      db: window.location.hostname.toString().split('.')[0],
    }
  },
  mounted() {
    //this.getDB()
  },
  methods: {
    getDB() {
      this.db = window.location.hostname.toString().split('.')[0]
    },
  },
}
</script>
