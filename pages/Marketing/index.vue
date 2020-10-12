<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row>
        {{ thai_date_and_time() }}
      </v-row>
    </v-col>
    <v-col cols="12" class="mt-5">
      <v-row>
        <h2>Campaign</h2>
        <v-spacer></v-spacer>
        <v-btn @click="createCampaign">+ Campaign</v-btn>
      </v-row>
    </v-col>
    <v-col cols="12" class="mt-2">
      <marketing-show-campaign></marketing-show-campaign>
    </v-col>
  </v-row>
</template>
<script>
export default {
  created() {
    setInterval(() => (this.now = new Date()), 1000)
  },
  data() {
    return { now: new Date() }
  },
  methods: {
    createCampaign(){
        this.$router.push({path:'/marketing/create'})
    },
    thai_date_and_time() {
      var d = this.now.getDate()
      var m = this.now.getMonth() + 1
      var y = this.now.getFullYear() + 543
      var hour = this.now.getHours()
      var min = this.now.getMinutes()
      var sec = this.now.getSeconds()
      var monthTH = [
        null,
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
      ]
      if (min <= 9) {
        min = '0' + min
      }
      if (sec <= 9) {
        sec = '0' + sec
      }
      if (hour <= 9) {
        hour = '0' + hour
      }
      var time =
        d +
        ' ' +
        monthTH[m] +
        ' ' +
        y +
        ' | เวลา ' +
        hour +
        ':' +
        min +
        ':' +
        sec +
        ' น.'
      return time
    },
  },
}
</script>
