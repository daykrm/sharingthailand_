<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
        <h2>จัดการข้อมูลลูกค้า</h2>
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
                  เพิ่มลูกค้า
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">ข้อมูลลูกค้า</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="ชื่อบริษัท"
                          v-model="data.company_name"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="ผู้ดูแล"
                          v-model="data.name"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="เบอร์โทร"
                          v-model="data.phone"
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
                      <v-col cols="12">
                        <v-text-field
                          label="Database"
                          v-model="data.prefix_db"
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
  middleware: ['isNotAuth', 'isAdmin'],
  data() {
    return {
      filter: '',
      columns: [
        { text: 'ID', value: 'ID', align: 'start', sortable: false },
        { text: 'ผู้ดูแล', value: 'name' },
        { text: 'ชื่อบริษัท', value: 'company_name' },
        { text: 'เบอร์โทร', value: 'phone' },
        { text: 'Database', value: 'prefix_db' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
      items: [],
      dialog: false,
      data: {
        ID: '',
        name: '',
        company_name: '',
        phone: '',
        username: '',
        password: '',
        prefix_db: '',
      },
      dialogDelete: false,
      editID: '',
      loading: false,
      absolute: true,
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser() {
      const data = { func: 'get_user' }
      axios.post('/api', data).then((res) => {
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
      this.editID = item.ID
    },
    resetData() {
      this.data = {
        ID: '',
        name: '',
        company_name: '',
        phone: '',
        username: '',
        password: '',
        prefix_db: '',
      }
      this.dialog = false
    },
    deleteItemConfirm() {
      var item = this.editID
      const data = { func: 'del_user', ID: item }
      axios.post('/api', data).then((res) => {
        if (res.data == 'success') {
          this.getUser()
        } else {
          res.data
        }
      })
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
    async submitForm() {
      var form = this.data
      if (
        form.name == '' ||
        form.company_name == '' ||
        form.phone == '' ||
        form.username == '' ||
        form.password == '' ||
        form.prefix_db == ''
      ) {
        alert('กรุรากรอกข้อมูลให้ครบถ้วน')
      } else {
        //alert('ok')
        this.loading = true
        const data = {
          func: 'add_user',
          ID: form.ID,
          name: form.name,
          company_name: form.company_name,
          phone: form.phone,
          username: form.username,
          password: form.password,
          prefix_db: form.prefix_db,
        }
        await axios.post('/api', data).then((res) => {
          if (res.data == 'success') {
            alert('เพิ่มข้อมูลสำเร็จ')
          } else {
            alert(res.data)
          }
        })
        this.resetData()
        this.getUser()
        this.loading = false
        this.dialog = false
      }
    },
  },
}
</script>
