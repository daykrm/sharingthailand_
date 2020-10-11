<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
        <h2>ตั้งค่าข้อมูลบริษัท</h2>
      </v-col>
      <v-col cols="12" class="mt-5">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="6">
            <div class="mobile-dark">
              <div class="bg-mobile">
                <div class="bg-header" v-bind:style="{ backgroundColor : app_color.color ? app_color.color : selectColor}">
                  <div class="pa-1">
                    <v-img
                      lazy-src="http://via.placeholder.com/30x40"
                      max-width="50"
                      :src="imagePreviewUrl"
                    ></v-img>
                  </div>
                </div>
                <v-img v-if="mockImg" :src="mockImg"></v-img>
                <div class="text-center bg-footer" v-bind:style="{ backgroundColor : app_color.color ? app_color.color : selectColor}">asdasda</div>
              </div>
              <!-- place your image here, inside the mobile wrapper -->
              <!-- <img src="http://via.placeholder.com/315x100" /> -->
            </div>
          </v-col>
          <!-- <v-img
            v-if="imagePreviewUrl"
            max-height="100"
            max-width="250"
            :src="imagePreviewUrl"
          ></v-img> -->
          <v-col cols="4" @keyup.enter="submitData">
            <v-col cols="12">
              <v-select
                :items="items"
                v-model="app_color"
                item-text="color"
                item-value="theme_id"
                label="เลือกสี"
                ref="app_color"
                return-object
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
                @change="previewImg"
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
      img_logo: null,
      imgPath: null,
      imagePreviewUrl: null,
      hasImg: false,
      mockImg: '',
      selectColor : ''
    }
  },
  mounted() {
    this.getTheme()
    this.getCompanySetting()
    this.getMockImg()
    //this.test()
  },
  methods: {
    getMockImg() {
      axios.get('/api/mockImg').then((res) => {
        this.mockImg = `data:image/jpeg;base64,${res.data}`
      })
    },
    previewImg() {
      if (this.img_logo != null) {
        this.imagePreviewUrl = URL.createObjectURL(this.img_logo)
      } else {
        var tmp = this.tmpImg
        this.imagePreviewUrl = tmp
      }
    },
    getTheme() {
      axios.get('/api/theme').then((res) => {
        console.log(res.data);
        this.items = res.data
      })
    },
    getCompanySetting() {
      axios.get(`/api/company/${this.db}`).then((res) => {
        console.log('company :', res.data)
        this.app_color = res.data.data.theme_id
        this.company_name = res.data.data.name
        this.address = res.data.data.address
        this.phone = res.data.data.phone
        this.email = res.data.data.email
        this.img_logo = null
        this.imagePreviewUrl = `data:image/png;base64,${res.data.logoURL}`
        this.tmpImg = `data:image/png;base64,${res.data.logoURL}`
        if (
          res.data.data.logo == '' ||
          res.data.data.logo == null ||
          res.data.data.logo == '-'
        ) {
          this.hasImg = false
        } else {
          this.hasImg = true
        }
        axios.get(`/api/theme/${res.data.data.theme_id}`).then(color=>{
        this.selectColor = color.data
      })
      })
    },
    validate() {
      if (this.company_name == '' || this.company_name == null) {
        alert('กรุณาระบุชื่อบริษัท')
        this.$refs.company_name.focus()
        return false
      } else if (this.address == '' || this.address == null) {
        alert('กรุณาระบุที่อยู่')
        this.$refs.address.focus()
        return false
      } else if (this.phone == '' || this.phone == null) {
        alert('กรุณาเบอร์โทร')
        this.$refs.phone.focus()
        return false
      } else if (this.email == '' || this.email == null) {
        alert('กรุณาระบุ email')
        this.$refs.email.focus()
        return false
      } else if (this.hasImg == false && this.img_logo == null) {
        alert('กรุณาเพิ่มรูปภาพ Logo')
        this.$refs.img_logo.focus()
        return false
      } else {
        return true
      }
    },
    async recodeDoc() {
      let settings = { headers: { 'content-type': 'multipart/form-data' } }
      var formData = new FormData()
      formData.append('images', this.img_logo)
      this.imgPath = await axios
        .post('/api/upload', formData, settings)
        .then((res) => {
          return res.data.images
        })
      const data = {
        company_name: this.company_name,
        theme_id: this.app_color.theme_id,
        images: this.imgPath,
        address: this.address,
        phone: this.phone,
        email: this.email,
      }
      axios.put(`/api/company/${this.db}`, data).then((res) => {
        if (res.status == 200) {
          alert('แก้ไขข้อมูลสำเร็จ')
        } else {
          alert(res.data.message)
        }
      })
    },
    async submitData() {
      if (this.validate()) {
        await this.recodeDoc()
        await this.getCompanySetting()
      }
    },
  },
}
</script>
<style scoped>
.mobile-light,
.mobile-dark {
  position: relative;
  display: inline-block;
  border-radius: 60px;
  padding: 80px 24px;
}

.mobile-light {
  background: #f0f0f0;
  background: linear-gradient(135deg, #f0f0f0, #fafafa);
}

.mobile-dark {
  background: #333333;
  background: linear-gradient(135deg, #333333, #4e4d4d);
}

.mobile-dark:before,
.mobile-light:before {
  content: '';
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  height: 5px;
  width: 60px;
  border-radius: 10px;
}

.mobile-light:before {
  background-color: #d7d7d7;
}

.mobile-dark:before {
  background-color: #4e4d4d;
}
.bg-mobile {
  background-color: #f0f0f0;
  width: 267px;
  height: 542px;
}
.bg-header {
  background-color: #ff0000;
  height: 60px;
}
.bg-footer {
  background-color: #ff0000;
  height: 26px;
}
</style>
