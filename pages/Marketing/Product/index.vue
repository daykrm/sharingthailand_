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
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      filter: '',
      db: window.location.hostname.toString().split('.')[0],
      parent_id: 1,
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
      this.insertDraft()
      this.$router.push({
        name: 'Marketing-Product-create',
        params: { parent_id: this.parent_id },
      })
    },
    getParentID() {
      axios.get(`/api/product/lastrow/${this.db}`).then((res) => {
        if (res.data.length == 0) {
          this.parent_id = 1
        } else {
          this.parent_id += res.data.parent_id
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
