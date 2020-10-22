<template>
  <v-row>
  </v-row>
</template>
<script>
//import axios from 'axios'

export default {
  mounted() {
    //this.getUser()
    this.db = window.location.hostname.toString().split('.')[0]
  },
  data(){
    return{
      db : ''
    }
  },
  methods: {
    getUser() {
      var db = window.location.hostname.toString().split('.')[0]
    },
  },
}
</script>
