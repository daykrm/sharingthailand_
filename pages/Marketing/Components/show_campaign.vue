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
                <v-col cols="4"
                  >สถานะ : {{ status ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</v-col
                >
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: 'show-campaign',
  created() {
    setInterval(() => (this.now = new Date()), 1000)
  },
  mounted() {
    this.campaign_status = this.status
    //console.log(this.startDate.toLocaleString("th-TH"))
  },
  methods: {},
  data() {
    return {
      now: new Date(),
      campaign_status: null,
    }
  },
  computed: {
    time: function () {
      return this.endDate - this.now
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
