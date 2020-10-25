<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" md="5">
          <v-img max-width="1200" :src="img"></v-img>
        </v-col>
        <v-col cols="12" md="7" style="font-size: 1em">
          <v-row no-gutters>
            <v-col cols="6">
              {{ name }}
              <span
                class="fb-share-button"
                data-href="https://sharingthailand.com/Marketing/Campaign/"
                data-layout="button"
                data-size="small"
                @click.stop=""
              >
                <a
                  target="_blank"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsharingthailand.com%2FMarketing%2FCampaign%2F&amp;src=sdkpreparse"
                  class="fb-xfbml-parse-ignore"
                  >แชร์</a
                >
              </span>
            </v-col>
            <v-col cols="6">
              <countdown :time="time">
                <template slot-scope="props"
                  >สิ้นสุด : {{ props.days }}d : {{ props.hours }}h :
                  {{ props.minutes }}m : {{ props.seconds }}s</template
                >
              </countdown>
            </v-col>
            <v-col cols="12">
              ระยะเวลา : {{ startDate.toLocaleString('th-TH') }} -
              {{ endDate.toLocaleString('th-TH') }}
            </v-col>
            <v-col cols="12"> โปรโมชั่น </v-col>
            <v-col cols="12">
              <template v-for="(pro, i) in promotion">
                <v-row no-gutters :key="i">
                  <v-col cols="6" class="pl-5"
                    >{{ pro.from_number }} - {{ pro.to_number }} คน</v-col
                  >
                  <v-col cols="6" class="pl-5"
                    >ลดราคา
                    {{ pro.rate_percent ? pro.rate_percent : pro.rate_money }}
                    {{ pro.rate_percent ? 'เปอร์เซ็นต์' : 'บาท' }}</v-col
                  >
                </v-row>
              </template>
            </v-col>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="4"
                  >จำนวนสินค้าที่ร่วมรายการ {{ product.length }} ชิ้น</v-col
                >
                <v-spacer></v-spacer>
                <!-- <v-col cols="4"
                  >สถานะ : {{ status ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</v-col
                > -->
                <v-col cols="4">
                  <v-switch
                    label="สถานะ"
                    @click.stop="updateStatus"
                    v-model="campaign_status"
                    color="success"
                    hide-details
                    class="ma-0 pa-0"
                    :false-value="0"
                    :true-value="1"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>
<script>
import axios from 'axios'
export default {
  name: 'show-campaign',
  created() {
    setInterval(() => (this.now = new Date()), 1000)
  },
  mounted() {
    this.campaign_status = this.status
    this.db = window.location.hostname.split('.')[0]
    //console.log(this.startDate.toLocaleString("th-TH"))
  },
  methods: {
    updateStatus(){
      //console.log('status',this.campaign_status);
      //console.log('id',this.id);
      console.log(this.db);
      axios.put(`/api/status/${this.db}/${this.id}`,{status : this.campaign_status}).then(res=>{
        //console.log(res.data)
        alert('แก้ไขสถานะสำเร็จ')
      }).catch(err => {
        alert(err)
      })
    }
  },
  data() {
    return {
      now: new Date(),
      sw: 0,
      campaign_status: null,
      db : ''
    }
  },
  computed: {
    time: function () {
      if (this.endDate > this.now) {
        return this.endDate - this.now
      } else {
        return 0
      }
    },
  },
  props: {
    name: {
      type: String,
      default: 'SharingThailand',
    },
    id: {
      type: [String, Number],
      default: 0,
    },
    startDate: {
      type: Date,
      default: function () {
        return new Date()
      },
    },
    endDate: {
      type: Date,
      default: function () {
        return new Date()
      },
    },
    img: {
      type: String,
      default: 'http://via.placeholder.com/1200x630',
    },
    status: {
      type: [String, Number],
      default: 0,
    },
    promotion: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
}
</script>
