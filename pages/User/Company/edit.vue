<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
        <h2>ตั้งค่ารหัสผ่าน</h2>
      </v-col>
      <v-col cols="12" class="mt-10">
        <v-text-field
          label="Username"
          v-model="username"
          ref="username"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
          ref="password"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="ยืนยัน Password"
          v-model="password_confirm"
          type="password"
          ref="password_confirm"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="ชื่อ"
          v-model="firstname"
          ref="firstname"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="นามสกุล"
          v-model="lastname"
          ref="lastname"
          clearable
        ></v-text-field>
      </v-col>
      <v-row class="mt-5">
        <v-spacer></v-spacer>
        <v-btn @click="submitData" type="submit">บันทึก</v-btn>
        <v-btn class="mx-5" @click="getUser">ยกเลิก</v-btn>
        <v-spacer></v-spacer>
      </v-row>
    </v-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      username: '',
      password: '',
      password_confirm: '',
      firstname: '',
      lastname: '',
      user_id: '',
      status:'',
      db: '',
    }
  },
  async mounted() {
    this.db = await window.location.hostname.toString().split('.')[0]
    this.user_id = this.$cookies.get('user_id')
    this.status = this.$cookies.get('user_status')
    await this.getUser()
  },
  methods: {
    getUser() {
      axios.get(`/api/marketing/${this.db}/${this.user_id}`).then((res) => {
        this.username = res.data.username
        this.password = res.data.password
        this.lastname = res.data.lastname
        this.firstname = res.data.firstname
      })
    },
    validate() {
      if (this.username == '' || this.username == null) {
        alert('กรุณาใส่ Username')
        this.$refs.username.focus()
        return false
      } else if (this.password == '' || this.password == null) {
        alert('กรุณาใส่ Password')
        this.$refs.password.focus()
        return false
      } else if (this.password != this.password_confirm) {
        alert('รหัสผ่านไม่ตรงกัน')
        this.$refs.password_confirm.focus()
        return false
      } else if (this.firstname == '' || this.firstname == null) {
        alert('กรุณาใส่ชื่อ')
        this.$refs.firstname.focus()
        return false
      } else if (this.lastname == '' || this.lastname == null) {
        alert('กรุณาใส่นามสกุล')
        this.$refs.lastname.focus()
        return false
      } else {
        return true
      }
    },
    submitData() {
      if (this.validate()) {
        const data = {
          username: this.username,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname,
          status : this.status
        }
        axios
          .put(`/api/marketing/${this.db}/${this.user_id}`, data)
          .then((res) => {
            if (res.status == 200) {
              alert('แก้ไขข้อมูลสำเร็จ')
            }
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      }
    },
  },
}
</script>
