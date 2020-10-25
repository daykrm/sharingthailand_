<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center"><h1>Campaign</h1></v-col>
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
                  <v-col cols="12" md="8">
                    <v-card color="#dedede" light
                      ><v-img
                        v-if="previewImg"
                        max-width="1200"
                        max-height="630"
                        :src="previewImg"
                        lazy-src="http://via.placeholder.com/1200x630"
                      ></v-img>
                      <v-img
                        v-else
                        max-width="1200"
                        max-height="630"
                        src="http://via.placeholder.com/1200x630"
                      ></v-img>
                      <v-card-text>
                        <div>{{ db.toUpperCase() }}.SHARINGTHAILAND.COM</div>
                        <p
                          class="display-1"
                          v-if="og_title == '' || og_title == null"
                        >
                          SharingThailand
                        </p>
                        <p class="display-1">{{ og_title }}</p>
                        <div
                          v-if="og_description == '' || og_description == null"
                        >
                          My description
                        </div>
                        <div>
                          {{ og_description }}
                        </div>
                      </v-card-text>
                    </v-card>
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
                        dateFormat="yyyy-MM-dd"
                        :date-picker-props="startDateProps"
                        :time-picker-props="timeProps"
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
                        dateFormat="yyyy-MM-dd"
                        :date-picker-props="dateProps"
                        :time-picker-props="timeProps"
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
                <v-btn color="primary" @click="formStep = 2"> ถัดไป </v-btn>
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
                    item-key="parent_id"
                    v-model="selectProduct"
                  >
                    <template v-slot:item.img="{ item }">
                      <v-img max-width="100" :src="item.img"></v-img>
                    </template>
                    <template v-slot:item.sell_price="{ item }">
                      <span>{{
                        item.min_sell_price +
                        ' - ' +
                        item.max_sell_price +
                        ' บาท'
                      }}</span>
                    </template>
                    <template v-slot:item.cost="{ item }">
                      <span>{{
                        item.min_cost + ' - ' + item.max_cost + ' บาท'
                      }}</span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <div class="text-center">
                <v-btn color="primary" @click="formStep = 1"> ย้อนกลับ </v-btn>
                <v-btn @click="cancel"> ยกเลิก </v-btn>
                <v-btn color="primary" @click="validate"> ยืนยัน </v-btn>
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
  middleware: ['isNotAuth'],
  data() {
    return {
      db: '',
      formStep: 1,
      filter: '',
      singleSelect: false,
      dialogDelete: false,
      editedIndex: -1,
      startDate: null,
      endDate: null,
      campaign_img: null,
      dateProps: {
        min: null,
        color: 'primary',
        headerColor: 'black',
      },
      startDateProps: {
        color: 'primary',
        headerColor: 'black',
      },
      timeProps: {
        format: '24hr',
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
        { text: 'รูปสินค้า', value: 'img' },
        { text: 'ยอดวิว', value: 'view' },
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
      imagePath: '',
    }
  },
  watch: {
    startDate(val) {
      if (val) {
        this.dateProps.min = this.$refs.startDate.date
        this.startDate = this.$refs.startDate.formattedDatetime
        console.log(this.$refs.startDate)
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
        this.endDate = this.$refs.endDate.formattedDatetime
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
  async mounted() {
    this.db = await window.location.hostname.toString().split('.')[0]
    await this.getProduct()
  },
  methods: {
    validate() {
      this.valid = this.$refs.form.validate()
      if (this.startDate == null) {
        alert('กรุณาเลือกวันเริ่มแคมเปญ')
        this.formStep = 1
        return
      } else if (this.endDate == null) {
        alert('กรุณาเลือกวันสิ้นสุดแคมเปญ')
        this.formStep = 1
        return
      } else if (this.promotion.length == 0) {
        alert('กรุณาเพิ่มโปรโมชั่น')
        this.formStep = 1
        return
      } else {
        if (this.valid) {
          // กรอกข้อมูล step 1 ครบ
          this.formStep = 2
          if (this.selectProduct.length == 0) {
            alert('กรุณาเลือกสินค้าที่ร่วมรายการ')
            return
          } else {
            //ข้อมูลครบถ้วนทั้ง 2 step
            this.saveCampaign()
          }
        } else {
          alert('กรุณากรอกข้อมูลข้อครบถ้วน')
          this.formStep = 1
        }
      }
    },
    async saveCampaign() {
      var product = []
      this.selectProduct.forEach((val) => {
        product.push(val.parent_id)
      })

      let settings = { headers: { 'content-type': 'multipart/form-data' } }
      var formData = new FormData()
      formData.append('images', this.campaign_img)
      axios
        .post(`/api/upload`, formData, settings)
        .then((image) => {
          const data = {
            name: this.campaign_name,
            start_date: this.startDate,
            end_date: this.endDate,
            campaign_img: image.data.images,
            status: 1,
            og_title: this.og_title,
            og_description: this.og_description,
            promotion: this.promotion,
            product: product,
          }
          axios
            .post(`/api/campaign/${this.db}`, data)
            .then((res) => {
              if (res.status == 200) {
                alert('สร้างแคมเปญสำเร็จ')
                this.$router.go(-1)
              }
            })
            .catch((err) => {
              alert('ไม่สามารถสร้างแคมเปญได้ กรุณาลองใหม่ในภายหลัง')
              this.$router.go(-1)
            })
        })
        .catch((error) => {
          alert('ไม่สามารถสร้างแคมเปญได้ กรุณาลองใหม่ในภายหลัง')
          this.$router.go(-1)
          return
        })
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
        console.log(res.data)
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
