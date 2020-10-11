<template>
  <div>
    <v-file-input
      accept="image/*"
      v-model="images"
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
      images: null,
      testImg : null
    }
  },
  mounted() {
    //this.testLogin()
    //this.getUser()
  },
  methods: {
    test() {
      let settings = { headers: { 'content-type': 'multipart/form-data' } }
      var formData = new FormData()
      formData.append('images', this.images)
      axios.post('/api/upload', formData, settings).then((res) => {
        console.log(res.data.images);
        this.testImg = res.data.images
        // console.log(res.data)  // img path
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
