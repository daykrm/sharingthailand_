<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row>
        
      </v-row>
    </v-col>
    <v-col cols="12" class="mt-5">
      <v-row>
        <h2>Campaign</h2>
        <v-spacer></v-spacer>
        <v-btn @click="createCampaign">+ Campaign</v-btn>
      </v-row>
    </v-col>
    <v-col cols="12" class="mt-2" v-if="campaign">
      <template v-for="(camp, i) in campaign">
        <marketing-show-campaign
          :key="i"
          :name="camp.campaign.name"
          :id="camp.campaign.campaign_id"
          :startDate="new Date(camp.campaign.start_date)"
          :endDate="new Date(camp.campaign.end_date)"
          :img="camp.img"
          :status="camp.campaign.status"
          :promotion="camp.promotion"
          :product="camp.product"
          @click.native="edit(camp.campaign.campaign_id)"
        ></marketing-show-campaign>
      </template>
    </v-col>
  </v-row>
</template>
<script>
export default {
  created() {
    setInterval(() => (this.now = new Date()), 1000)
  },
  data() {
    return { now: new Date(), db: '', campaign: [] }
  },
  async mounted() {
    this.db = await window.location.hostname.split('.')[0]
    this.getCampaign()
  },
  methods: {
    edit(id){
      this.$router.push({name : 'Marketing-Campaign-edit' , params : { campaign_id : id }})
    },
    createCampaign() {
      this.$router.push({ path: '/Marketing/Campaign/create' })
    },
    getCampaign() {
      this.$axios
        .get(`/campaign/${this.db}`)
        .then((res) => {
          this.campaign = res.data
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
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
