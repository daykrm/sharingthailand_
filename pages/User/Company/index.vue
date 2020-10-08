<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
        <h2>ตั้งค่าข้อมูลบริษัท</h2>
        <img :src="img"/>
      </v-col>
      <v-col cols="12" class="mt-5">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="6">รูปมือถือ live preview</v-col>
          <v-col cols="4" @keyup.enter="submitData">
            <v-col cols="12">
              <v-select
                :items="items"
                v-model="app_color"
                label="เลือกสี"
                ref="app_color"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="ชื่อบริษัท"
                v-model="company_name"
                ref="company_name"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                label="ที่อยู่"
                value=""
                v-model="address"
                ref="address"
                auto-grow
                clearable
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="เบอร์โทร"
                v-model="phone"
                ref="phone"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Email"
                v-model="email"
                ref="email"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-file-input
                accept="image/*"
                v-model="img_logo"
                label="Logo"
                ref="img_logo"
              ></v-file-input>
            </v-col>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn @click="submitData" type="submit">บันทึก</v-btn>
          <v-btn class="mx-5">ยกเลิก</v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  middleware: ['isNotAuth'],
  data() {
    return {
      db: window.location.hostname.toString().split('.')[0],
      items: [],
      app_color: '',
      company_name: '',
      address: '',
      phone: '',
      email: '',
      myCroppa: {},
      img_logo: null,
      img: null,
    }
  },
  mounted() {
    this.getTheme()
    this.getCompanySetting()
    this.test()
  },
  methods: {
    getTheme() {
      const data = { func: 'get_theme' }
      axios.post('/api', data).then((res) => {
        //console.log(res.data)
        this.items = res.data
      })
    },
    getCompanySetting() {
      const data = { func: 'get_company', db: this.db }
      axios.post('/api', data).then((res) => {
        //console.log(res.data.name);
        this.app_color = res.data.theme_id
        this.company_name = res.data.name
        this.address = res.data.address
        this.phone = res.data.phone
        this.email = res.data.email
      })
    },
    validate() {
      var vm = this
      if (
        (vm.app_color == '',
        vm.company_name == '',
        vm.address == '',
        vm.phone == '',
        vm.email == '',
        vm.img_logo == null)
      ) {
        if (vm.app_color == '') {
          alert('กรุณาเลือกสี')
          this.$refs.app_color.focus()
        } else if (vm.company_name == '') {
          alert('กรุณาระบุชื่อบริษัท')
          this.$refs.company_name.focus()
        } else if (vm.address == '') {
          alert('กรุณาใส่รายละเอียด')
          this.$refs.address.focus()
        } else if (vm.phone == '') {
          alert('กรุณาระบุเบอร์โทร')
          this.$refs.phone.focus()
        } else if (vm.email == '') {
          alert('กรุณาระบุ email')
          this.$refs.email.focus()
        } else {
          alert('กรุณาเพิ่มรูปภาพ')
          this.$refs.img_logo.focus()
        }
        return false
      } else {
        return true
      }
    },
    recodeDoc() {
      let settings = { headers: { 'content-type': 'multipart/form-data' } }
      var formData = new FormData()
      formData.append('func', 'company_setting')
      formData.append('theme_id', this.app_color)
      formData.append('company_name', this.company_name)
      formData.append('address', this.address)
      formData.append('phone', this.phone)
      formData.append('email', this.email)
      formData.append('img_logo', this.img_logo)
      formData.append('db', this.db)

      axios.post('/api', formData, settings).then((res) => {
        if (res.data == 'success') {
          alert('บันทึกข้อมูลเสร็จสิ้น')
        } else {
          console.log(res.data)
        }
      })
    },
    submitData() {
      this.recodeDoc()
    },
    test() {
      const data = { func: 'test' }
      axios.post('/api', data).then((res) => {
        this.img = "data:image/jpg;charset=utf8;base64," + res.data
      })
    },
  },
}
</script>
