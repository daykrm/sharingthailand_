<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">จัดการลักษณะสินค้า</v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <label>ลักษณะสินค้า</label>
            <v-row no-gutters>
              <v-text-field
                label="ค้นหา"
                class="pa-0 ma-0"
                v-model="taxFilter"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="attrDialog = true">เพิ่ม</v-btn>
            </v-row>
            <v-data-table
              :headers="taxonomyCol"
              :items="taxonomyItems"
              :search="taxFilter"
            >
              <template v-slot:no-data> ไม่มีข้อมูล </template>
            </v-data-table>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="7">
            <label>รายละเอียด</label>
            <v-row no-gutters>
              <v-text-field
                label="ค้นหา"
                class="pa-0 ma-0"
                v-model="termFilter"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="termDialog = true">เพิ่ม</v-btn>
            </v-row>
            <v-data-table
              :headers="termCol"
              :items="termItems"
              :search="termFilter"
            >
              <template v-slot:no-data> ไม่มีข้อมูล </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="termEdit(item)">
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">แก้ไขรายละเอียด</v-col>
        </v-card-title>
        <v-card-text>
          <v-row @keyup.enter="saveTerm">
            <v-col cols="12">
              <v-text-field v-model="catName" label="Name"></v-text-field>
              <small>Name เป็นชื่อประเภทสินค้าที่ใช้แสดงบนเว็บไซต์</small>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="catSlug" label="Slug"></v-text-field>
              <small
                >Slug เป็น URL-friendly ของชื่อ
                กรุณาระบุเป็นภาษาอังกฤษและตัวเลขเท่านั้น</small
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="close" text>ยกเลิก</v-btn>
          <v-btn color="teal lighten-1" @click="saveTerm">บันทึก</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="attrDialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">เพิ่มลักษะณะ</v-col>
        </v-card-title>
        <v-card-text>
          <v-row @keyup.enter="saveAttr">
            <v-col cols="12">
              <v-text-field v-model="catName" label="Name"></v-text-field>
              <small>Name เป็นชื่อประเภทสินค้าที่ใช้แสดงบนเว็บไซต์</small>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="catSlug" label="Slug"></v-text-field>
              <small
                >Slug เป็น URL-friendly ของชื่อ
                กรุณาระบุเป็นภาษาอังกฤษและตัวเลขเท่านั้น</small
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="close" text>ยกเลิก</v-btn>
          <v-btn color="teal lighten-1" @click="saveAttr">บันทึก</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="termDialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">เพิ่มรายละเอียด</v-col>
        </v-card-title>
        <v-card-text>
          <v-row @keyup.enter="createTerm">
            <v-select
              :items="taxonomyItems"
              item-text="attr_label"
              item-value="attr_name"
              v-model="selectAttr"
              label="เลือกลักษณะสินค้า"
            ></v-select>
            <v-col cols="12">
              <v-text-field v-model="catName" label="Name"></v-text-field>
              <small>Name เป็นชื่อประเภทสินค้าที่ใช้แสดงบนเว็บไซต์</small>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="catSlug" label="Slug" @keypress="engOnly"></v-text-field>
              <small
                >Slug เป็น URL-friendly ของชื่อ
                กรุณาระบุเป็นภาษาอังกฤษและตัวเลขเท่านั้น</small
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="close" text>ยกเลิก</v-btn>
          <v-btn color="teal lighten-1" @click="createTerm">บันทึก</v-btn>
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
      taxFilter: '',
      termFilter: '',
      dialog: false,
      attrDialog: false,
      termDialog: false,
      catName: '',
      catSlug: '',
      term_id: '',
      loading: false,
      absolute: true,
      db: '',
      taxonomyCol: [
        { text: 'Slug', value: 'attr_name' },
        { text: 'Name', value: 'attr_label' },
        //{ text: 'จัดการ', value: 'actions', sortable: false },
      ],
      taxonomyItems: [],
      termCol: [
        { text: 'ลักษณะ', value: 'taxonomy', align: 'start' },
        { text: 'Name', value: 'name' },
        { text: 'Slug', value: 'slug' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
      termItems: [],
      selectAttr: '',
    }
  },
  async mounted() {
    this.db = await window.location.hostname.toString().split('.')[0]
    this.getAttr()
  },
  methods: {
    engOnly(e) {
        let keyCode = (e.keyCode ? e.keyCode : e.which)
        if(keyCode < 65 || keyCode > 90){
            e.preventDefault()
        }
    },
    getAttr() {
      axios.get(`/api/product/attr/${this.db}`).then((res) => {
        this.taxonomyItems = res.data
      })
      axios.get(`/api/product/term/${this.db}`).then((res) => {
        this.termItems = res.data
      })
    },
    termEdit(item) {
      this.dialog = true
      this.catName = item.name
      this.catSlug = item.slug
      this.term_id = item.term_id
    },
    close() {
      this.dialog = false
      this.attrDialog = false
      this.termDialog = false
      this.catSlug = ''
      this.catName = ''
      this.term_id = ''
    },
    async saveAttr() {
      if (this.catName == '') {
        alert('กรุณาระบุ Name')
        return
      } else {
        alert('กรุณาระบุ Slug')
        return
      }
      this.loading = true
      const data = {
        attr_name: this.catSlug,
        attr_label: this.catName,
      }
      await axios
        .post(`/api/product/attr/${this.db}`, data)
        .then((res) => {
          if (res.status == 200) {
            alert('เพิ่มข้อมุลสำเร็จ')
          }
        })
        .catch((err) => {
          alert('เกิดข้อผิดพลาด', err)
        })
      await this.getAttr()
      await this.close()
      this.loading = await false
    },
    async createTerm() {
      if (this.selectAttr == '' || this.selectAttr == null) {
        alert('กรุณาเลือกลักษณะสินค้า')
        return
      } else if (this.catName == '') {
        alert('กรุณาระบุ Name')
        return
      } else {
        alert('กรุณาระบุ Slug')
        return
      }
      this.loading = true
      const data = {
        name: this.catName,
        slug: this.catSlug,
      }
      await axios
        .post(`/api/product/term/${this.db}/${this.selectAttr}`, data)
        .then((res) => {
          if (res.status == 200) {
            alert('เพิ่มข้อมุลสำเร็จ')
          }
        })
        .catch((err) => {
          alert('เกิดข้อผิดพลาด', err)
        })
      await this.getAttr()
      await this.close()
      this.loading = await false
    },
    async saveTerm() {
      if (this.catName == '') {
        alert('กรุณาระบุ Name')
        return
      } else {
        alert('กรุณาระบุ Slug')
        return
      }
      this.loading = true
      const data = {
        name: this.catName,
        slug: this.catSlug,
      }
      await axios
        .put(`/api/product/term/${this.db}/${this.term_id}`, data)
        .then((res) => {
          if (res.status == 200) {
            alert('แก้ไขข้อมูลสำเร็จ')
          }
        })
        .catch((err) => {
          alert(`แก้ไขข้อมูลล้มเหลว ${err}`)
        })
      await this.getAttr()
      await this.close()
      this.loading = await false
    },
  },
}
</script>
