<template>
  <div>
    <v-file-input
      accept="image/*"
      v-model="img_logo"
      label="Logo"
      ref="img_logo"
    ></v-file-input>
    <v-btn color="primary" @click="test">Upload</v-btn>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import axios from 'axios'

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
  data() {
    return {
      img_logo: null,
    }
  },
  mounted() {
    this.testLogin()
    //this.getUser()
  },
  methods: {
    test() {
      let settings = { headers: { 'content-type': 'multipart/form-data' } }
      var formData = new FormData()
      formData.append('img_logo', this.img_logo)
      axios.post('/api/upload', formData, settings).then((res) => {
        console.log(res.data)
      })
    },
    getUser() {
      axios.get('/api/user').then((res) => {
        console.log(res.data)
      })
    },
    testLogin() {
      axios
        .get('/api')
        .then((res) => {
          console.log(res.data)
        })
    },
  },
}
</script>
