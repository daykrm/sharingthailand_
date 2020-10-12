<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">Campaign</v-col>
      <v-col cols="12" md="8">
        <v-img
          max-width="1200"
          src="http://via.placeholder.com/1200x630"
        ></v-img>
      </v-col>
      <v-col cols="12" md="4">
        <v-col cols="12">
          <v-file-input
            accept="image/*"
            v-model="campaign_img"
            label="ภาพ"
            ref="campaign_img"
          ></v-file-input>
        </v-col>
        <v-col cols="12">
          <v-text-field label="ชื่อ"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-datetime-picker
            label="เริ่ม"
            v-model="startDate"
            time-format="HH:mm:ss"
            dateFormat="dd-MM-yyyy"
          >
            <template slot="dateIcon">
              <v-icon>mdi-calendar-range</v-icon>
            </template>
            <template slot="timeIcon">
              <v-icon>mdi-clock-outline</v-icon>
            </template>
            <template slot="actions" slot-scope="{ parent }">
              <v-btn color="error lighten-1" @click.native="parent.clearHandler"
                >Cancel</v-btn
              >
              <v-btn color="success darken-1" @click="parent.okHandler"
                >Done</v-btn
              >
            </template>
          </v-datetime-picker>
        </v-col>
        <v-col cols="12">
          <v-datetime-picker
            label="สิ้นสุด"
            v-model="endDate"
            time-format="HH:mm:ss"
            dateFormat="dd-MM-yyyy"
            :date-picker-props="dateProps"
          >
          </v-datetime-picker>
        </v-col>
        <v-col cols="12">
          <v-text-field label="หัวข้อ"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="รายละเอียด"></v-text-field>
        </v-col>
      </v-col>
      <v-col cols="12">เพิ่มโปรโมชั่นใหม่</v-col>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" md="2">
          <v-text-field label="จาก"></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="ถึง"></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="ลดราคา"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-radio-group row>
            <v-radio label="บาท" value="baht"></v-radio>
            <v-radio label="เปอร์เซ็นต์" value="percent"></v-radio>
            <v-btn>เพิ่ม</v-btn>
          </v-radio-group>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      campaign_img: null,
      dateProps: {
        min: null,
      },
    }
  },
  watch: {
    startDate(val) {
      if (val) {
        var date = val.toLocaleString().split(',')[0].split('/')
        this.dateProps.min = date[2] + '-' + date[0] + '-' + date[1]
      } else {
        this.dateProps.min = null
      }
    },
  },
  mounted() {},
  methods: {},
}
</script>
