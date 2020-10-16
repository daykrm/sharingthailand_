<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">จัดการสินค้า</v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="2">
            <v-btn @click="addProduct">เพิ่มสินค้า</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-text-field label="ค้นหา" v-model="filter"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-data-table :headers="columns" :search="filter"
          ><template v-slot:no-data> ไม่มีข้อมูล </template></v-data-table
        >
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-col class="text-center">ต้องการใช้แบบร่างล่าสุดหรือไม่</v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="newProduct" text
            >เพิ่มสินค้าใหม่</v-btn
          >
          <v-btn color="teal lighten-1" @click="useDraft">ใช้แบบร่าง</v-btn>
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
      filter: '',
      dialog: false,
      db: window.location.hostname.toString().split('.')[0],
      parent_id: 1,
      current_id : 0,
      columns: [
        { text: 'ชื่อสินค้า', value: 'name', align: 'start' },
        { text: 'SKU', value: 'SKU' },
        { text: 'รายละเอียด', value: 'details' },
        { text: 'ต้นทุน', value: 'cost' },
        { text: 'ราคาขาย', value: 'sell_price' },
        { text: 'สถานะ', value: 'status' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
    }
  },
  mounted() {
    this.getParentID()
  },
  methods: {
    addProduct() {
      if (this.current_id == 0) {
        this.newProduct()
      } else {
        this.dialog = true
      }
    },
    newProduct() {
      this.insertDraft()
      this.$router.push({
        name: 'Marketing-Product-create',
        params: { parent_id: this.parent_id,draft : 0 },
      })
    },
    useDraft() {
      this.$router.push({
        name: 'Marketing-Product-create',
        params: { parent_id: this.current_id,draft : 1 },
      })
    },
    getParentID() {
      axios.get(`/api/product/lastrow/${this.db}`).then((res) => {
        if (res.data.length == 0) {
          this.parent_id = 1
        } else {
          this.parent_id += res.data.parent_id
          this.current_id = res.data.parent_id
        }
        console.log(this.parent_id)
      })
    },
    insertDraft() {
      const data = {
        name: 'AUTO_DRAFT',
        details: '',
        sell_price: 0,
        cost: 0,
        SKU: '',
        status: 0,
        parent_id: this.parent_id,
      }
      axios
        .post(`/api/product/${this.db}`, data)
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          alert('ไม่สามารถเพิ่มสินค้าได้ โปรดลองใหม่ในภายหลัง')
          //this.$router.go(-1)
        })
    },
  },
}
</script>
