<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
        <h2>จัดการข้อมูลพนักงาน</h2>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4" class="mt-3">
            <v-dialog v-model="dialog" persistent max-width="600px">
              <center>
                <v-progress-circular
                  v-show="loading"
                  indeterminate
                  color="blue"
                ></v-progress-circular>
              </center>
              <v-overlay :value="loading" :absolute="absolute"></v-overlay>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="teal lighten-1" dark v-bind="attrs" v-on="on">
                  เพิ่มพนักงาน
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">ข้อมูลพนักงาน</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="ชื่อ"
                          v-model="data.firstname"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="นามสกุล"
                          v-model="data.lastname"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Username"
                          v-model="data.username"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Password"
                          v-model="data.password"
                          type="password"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <!-- <small>*indicates required field</small> -->
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="teal lighten-1" text @click="resetData">
                    ยกเลิก
                  </v-btn>
                  <v-btn color="teal lighten-1" text @click="submitForm">
                    บันทึก
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="6">
            <v-text-field
              v-model="filter"
              label="ค้นหา"
              color="teal lighten-1"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12">
            <v-data-table
              :headers="columns"
              :items="items"
              :items-per-page="5"
              :search="filter"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
              <template v-slot:no-data> ไม่มีข้อมูล </template>
            </v-data-table>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
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
      filter: '',
      columns: [
        { text: 'ID', value: 'user_id', align: 'start', sortable: false },
        { text: 'ชื่อ', value: 'firstname' },
        { text: 'นามกสุล', value: 'lastname' },
        { text: 'username', value: 'username' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
      items: [],
      dialog: false,
      data: {
        user_id: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        status: 0,
      },
      dialogDelete: false,
      editID: '',
      loading: false,
      absolute: true,
      db: window.location.hostname.toString().split('.')[0],
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser() {
      //const data = { func: 'get_user' }
      axios.get(`/api/marketing/${this.db}`).then((res) => {
        this.items = res.data
      })
    },
    editItem(item) {
      //console.log('edit', item)
      this.data = item
      this.dialog = true
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.editID = item.user_id
    },
    resetData() {
      this.data = {
        user_id: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        status: 0,
      }
      this.dialog = false
    },
    async deleteItemConfirm() {
      var item = this.editID
      const data = {user_id : item}
      await axios
        .delete(`/api/marketing/${this.db}/${item}`)
        .then((res) => {
          if (res.status == 200) {
            this.closeDelete()
          }
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
      this.getUser()
    },
    closeDelete() {
      this.dialogDelete = false
    },
    async submitForm() {
      var form = this.data
      if (
        form.firstname == '' ||
        form.lastname == '' ||
        form.username == '' ||
        form.password == ''
      ) {
        alert('กรุรากรอกข้อมูลให้ครบถ้วน')
      } else {
        //alert('ok')
        this.loading = true
        const data = {
          firstname: form.firstname,
          lastname: form.lastname,
          username: form.username,
          password: form.password,
          status: form.status,
        }
        if (form.user_id == '') {
          // New User
          console.log(this.db)
          await axios
            .post(`/api/marketing/${this.db}`, data)
            .then((res) => {
              if (res.status == 200) {
                alert('เพิ่มข้อมูลสำเร็จ')
                this.resetData()
                this.dialog = false
              } else {
                alert(res.data.message)
              }
            })
            .catch((err) => {
              alert(err.response.data.message)
            })
        } else {
          // Update User
          await axios
            .put(`/api/marketing/${this.db}/${this.data.user_id}`, this.data)
            .then((res) => {
              if (res.status == 200) {
                alert('แก้ไขข้อมูลสำเร็จ')
                this.resetData()
                this.dialog = false
              }
            })
            .catch((err) => {
              alert(err.response.data.message)
            })
        }
        await this.getUser()
        this.loading = false
      }
    },
  },
}
</script>
