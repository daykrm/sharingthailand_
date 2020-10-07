<template>
  <div></div>
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
  mounted() {
    this.test()
  },
  methods: {
    test() {
      axios.get('/api').then((res) => {
        console.log(res.data)
      })
    },
  },
}
</script>
