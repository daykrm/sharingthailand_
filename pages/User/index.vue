<template>
  <div>Dashboard</div>
</template>
<script>
import axios from 'axios'
export default {
  middleware: ['isNotAuth'],
  data() {
    return {
      db: '',
    }
  },
  async mounted() {
    this.db = await window.location.hostname.toString().split('.')[0]
    //this.getDB()
  },
  methods: {
  },
}
</script>
