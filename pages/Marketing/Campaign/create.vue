<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">Campaign</v-col>
      <v-col cols="12">
        <v-stepper non-linear v-model="formStep">
          <v-stepper-header>
            <v-stepper-step editable step="1">
              รายละเอียดแคมเปญ
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step editable step="2">
              สินค้าที่ร่วมรายการ
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row>
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
                        <v-btn
                          color="error lighten-1"
                          @click.native="parent.clearHandler"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="success darken-1"
                          @click="parent.okHandler"
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
                    <v-text-field
                      v-model="fromNumber"
                      label="จาก"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field v-model="toNumber" label="ถึง"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="discount"
                      label="ลดราคา"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-radio-group v-model="discountType" row>
                      <v-radio label="บาท" value="บาท"></v-radio>
                      <v-radio
                        label="เปอร์เซ็นต์"
                        value="เปอร์เซ็นต์"
                      ></v-radio>
                      <v-btn @click="addPromotion">เพิ่ม</v-btn>
                    </v-radio-group>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
                <v-col v-if="promotion.length != 0" cols="12"
                  >เพิ่มโปรโมชั่นใหม่</v-col
                >
                <v-col cols="12">
                  <v-data-table
                    v-if="promotion.length != 0"
                    :headers="columns"
                    hide-default-footer
                    :items="promotion"
                    class="elevation-1"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-icon small @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <template v-slot:item.discount="{ item }">
                      {{ item.discount + ' ' + item.discountType }}
                    </template>
                    <template v-slot:item.status="{ item }">
                      <v-switch
                        v-model="item.status"
                        color="success"
                        hide-details
                        :false-value="0"
                        :true-value="1"
                      ></v-switch>
                    </template>
                    <template v-slot:no-data> ไม่มีข้อมูล </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <div class="text-center">
                <v-btn color="primary" @click="formStep = 2"> ถัดไป </v-btn>
                <v-btn @click="cancel" text> ยกเลิก </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="mb-12" color="blue" height="200px"></v-card>
              <div class="text-center">
                <v-btn color="primary" @click="formStep = 1"> ย้อนกลับ </v-btn>
                <v-btn @click="cancel" text> ยกเลิก </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">คุณต้องการลบจริงหรือไม่ ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="teal lighten-1" text @click="deleteItemConfirm"
            >ยืนยัน</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formStep: 1,
      dialogDelete: false,
      editedIndex: -1,
      startDate: new Date(),
      endDate: new Date(),
      campaign_img: null,
      dateProps: {
        min: null,
      },
      promotion: [],
      fromNumber: '',
      toNumber: '',
      discount: '',
      discountType: 'บาท',
      columns: [
        { text: 'จาก', value: 'fromNumber', align: 'start' },
        { text: 'ถึง', value: 'toNumber' },
        { text: 'ลดราคา', value: 'discount' },
        { text: 'สถานะ', value: 'status' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
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
  methods: {
    resetValue() {
      this.fromNumber = ''
      this.toNumber = ''
      this.discount = ''
      this.discountType = 'บาท'
    },
    cancel() {
      this.$router.go(-1)
    },
    addPromotion() {
      this.promotion.push({
        fromNumber: this.fromNumber,
        toNumber: this.toNumber,
        discount: this.discount,
        discountType: this.discountType,
        status: 1,
      })
      this.resetValue()
    },
    deleteItem(item) {
      this.editedIndex = this.promotion.indexOf(item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.promotion.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
  },
}
</script>
