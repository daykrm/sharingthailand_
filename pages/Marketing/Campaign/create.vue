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
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" md="8" style="background-color: #3e3e3e">
                    <v-img
                      v-if="previewImg"
                      max-width="1200"
                      max-height="630"
                      :src="previewImg"
                      lazy-src="http://via.placeholder.com/1200x630"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-col cols="12">
                      <v-file-input
                        accept="image/*"
                        v-model="campaign_img"
                        label="ภาพ"
                        ref="campaign_img"
                        :rules="[(v) => !!v || 'กรุณาเลือกรูปภาพ']"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="ชื่อ"
                        v-model="campaign_name"
                        :rules="[(v) => !!v || 'กรุณาใส่ชื่อแคมเปญ']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-datetime-picker
                        label="เริ่ม"
                        v-model="startDate"
                        time-format="HH:mm:ss"
                        dateFormat="dd-MM-yyyy"
                        ref="startDate"
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
                        ref="endDate"
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
                      <v-text-field
                        label="หัวข้อ"
                        v-model="og_title"
                        :rules="[(v) => !!v || 'กรุณาใส่หัวข้อ']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="รายละเอียด"
                        v-model="og_description"
                        :rules="[(v) => !!v || 'กรุณาใส่รายละเอียด']"
                      ></v-text-field>
                    </v-col>
                  </v-col>
                  <v-col cols="12">เพิ่มโปรโมชั่นใหม่</v-col>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="fromNumber"
                        ref="fromNumber"
                        label="จาก"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="toNumber"
                        ref="toNumber"
                        label="ถึง"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="discount"
                        ref="discount"
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
              </v-form>
              <div class="text-center">
                <v-btn color="primary" @click="validate"> ถัดไป </v-btn>
                <v-btn @click="cancel" text> ยกเลิก </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-row>
                <v-col cols="12">
                  <v-spacer></v-spacer>
                  <v-text-field v-model="filter" label="ค้นหา"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-data-table
                    :headers="productColumns"
                    :items="products"
                    :search="filter"
                    show-select
                    item-key="product_id"
                    v-model="selectProduct"
                  >
                    <template v-slot:item.attr_data="{ item }">
                      <span v-for="(val, i) in item.attr_data" :key="i">
                        {{ val.attr_label + ' ' + val.name }}
                        <template v-if="i != item.attr_data.length - 1">
                          ,
                        </template>
                      </span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
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
import axios from 'axios'
export default {
  data() {
    return {
      db: window.location.hostname.toString().split('.')[0],
      formStep: 1,
      filter: '',
      singleSelect: true,
      dialogDelete: false,
      editedIndex: -1,
      startDate: null,
      endDate: null,
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
      productColumns: [
        { text: 'ชื่อสินค้า', value: 'name', align: 'start' },
        { text: 'SKU', value: 'SKU' },
        { text: 'ลักษณะสินค้า', value: 'attr_data' },
        { text: 'ต้นทุน', value: 'cost' },
        { text: 'ราคา', value: 'sell_price' },
      ],
      products: [],
      selectProduct: [],
      previewImg: null,
      nameRules: [(v) => !!v || `${v} is required`],
      valid: false,
      og_title: '',
      og_description: '',
      campaign_name: '',
    }
  },
  watch: {
    startDate(val) {
      if (val) {
        this.dateProps.min = this.$refs.startDate.date
        //console.log(this.$refs.endDate)
        this.$refs.endDate.clearHandler()
      } else {
        this.dateProps.min = null
      }
    },
    campaign_img(val) {
      if (val) {
        this.previewImg = URL.createObjectURL(val)
      } else {
        this.previewImg = null
      }
    },
    endDate(val) {
      if (val) {
        if (this.startDate == null) {
          alert('กรุณาเลือกวันเริ่มแคมเปญก่อน')
          this.$refs.endDate.clearHandler()
        } else {
          var check = this.endDate > this.startDate
          if (!check) {
            alert('กรุณาเลือกวันสิ้นสุดแคมเปญใหม่')
            this.$refs.endDate.clearHandler()
          }
          console.log(check)
        }
      }
    },
  },
  computed: {},
  mounted() {
    this.getProduct()
  },
  methods: {
    validate() {
      // this.valid = this.$refs.form.validate()
      // if (this.startDate == null) {
      //   alert('กรุณาเลือกวันเริ่มแคมเปญ')
      //   return
      // } else if (this.endDate == null) {
      //   alert('กรุณาเลือกวันสิ้นสุดแคมเปญ')
      //   return
      // } else if (this.promotion.length == 0) {
      //   alert('กรุณาเพิ่มโปรโมชั่น')
      //   return
      // } else {
      //   if (this.valid) {
      //     this.formStep = 2
      //   } else {
      //     alert('กรุณากรอกข้อมูลข้อครบถ้วน')
      //   }
      // }
      this.formStep = 2
    },
    resetValue() {
      this.fromNumber = ''
      this.toNumber = ''
      this.discount = ''
      this.discountType = 'บาท'
    },
    cancel() {
      this.$router.go(-1)
    },
    getProduct() {
      axios.get(`/api/product/status/${this.db}/1`).then(async (res) => {
        this.products = await res.data
        this.products.forEach((val) => {
          val.attr_data = JSON.parse(val.attr_details)
        })
      })
    },
    addPromotion() {
      if ((this.fromNumber == '' || this.toNumber == '', this.discount == '')) {
        if (this.fromNumber == '') {
          alert('กรุณาใส่จำนวนเริ่มต้น')
          this.$refs.fromNumber.focus()
        } else if (this.toNumber == '') {
          alert('กรุณาใส่จำนวนสิ้นสุด')
          this.$refs.toNumber.focus()
        } else {
          alert('กรุณาระบุราคาที่ลด')
          this.$refs.discount.focus()
        }
        return
      }
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
