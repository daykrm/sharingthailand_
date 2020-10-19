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
        <v-data-table :headers="columns" :items="items" :search="filter">
          <template v-slot:no-data> ไม่มีข้อมูล </template>
          <template v-slot:item.status="{ item }">
            <v-switch
              v-model="item.status"
              color="success"
              hide-details
              :false-value="0"
              :true-value="1"
            ></v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
          </template>
          <template v-slot:item.attr_data="{ item }">
            <span v-for="(val, i) in item.attr_data" :key="i">
              {{ val.attr_label + ' ' + val.name }}
              <template v-if="i != item.attr_data.length - 1"> , </template>
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-col class="text-center">ต้องการแก้ไขรายการล่าสุดหรือไม่</v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="newProduct" text
            >เพิ่มสินค้าใหม่</v-btn
          >
          <v-btn color="teal lighten-1" @click="useDraft"
            >แก้ไขรายการล่าสุด</v-btn
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
      filter: '',
      dialog: false,
      db: window.location.hostname.toString().split('.')[0],
      parent_id: 1,
      current_id: 0,
      columns: [
        { text: 'ชื่อสินค้า', value: 'name', align: 'start' },
        { text: 'SKU', value: 'SKU' },
        { text: 'รายละเอียด', value: 'details' },
        { text: 'ลักษณะสินค้า', value: 'attr_data' },
        { text: 'ต้นทุน', value: 'cost' },
        { text: 'ราคาขาย', value: 'sell_price' },
        { text: 'สถานะ', value: 'status' },
        { text: 'จัดการ', value: 'actions', sortable: false },
      ],
      items: [],
    }
  },
  mounted() {
    this.getParentID()
    this.getProduct()
    this.current_id = this.$cookies.get('draft') || 0
  },
  methods: {
    getProduct() {
      axios.get(`/api/product/${this.db}`).then(async (res) => {
        this.items = await res.data
        //console.log(res.data)
        this.items.forEach((val) => {
          val.attr_data = JSON.parse(val.attr_details)
        })
      })
    },
    editItem(item) {
      //alert(item.product_id)
      this.$cookies.set('draft', item.parent_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      this.$router.push({
        name: 'Marketing-Product-create',
        params: { parent_id: item.parent_id, draft: 1 },
      })
    },
    // deleteItem() {},
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
        params: { parent_id: this.parent_id, draft: 0 },
      })
    },
    useDraft() {
      this.$router.push({
        name: 'Marketing-Product-create',
        params: { parent_id: this.current_id, draft: 1 },
      })
    },
    getParentID() {
      axios.get(`/api/product/lastrow/${this.db}`).then((res) => {
        if (res.data.length == 0) {
          this.parent_id = 1
        } else {
          this.parent_id += res.data.parent_id
        }
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
        attr_details: [],
      }
      this.$cookies.set('draft', this.parent_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      axios
        .post(`/api/product/${this.db}`, data)
        .then((res) => {
          axios
            .post(`/api/product/meta/${this.db}`, {
              parent_id: this.parent_id,
              meta_key: 'view',
              meta_value: 0,
            })
            .catch((error) => {
              alert('ไม่สามารถเพิ่มสินค้าได้ โปรดลองใหม่ในภายหลัง')
              //this.$router.go(-1)
            })
        })
        .catch((err) => {
          alert('ไม่สามารถเพิ่มสินค้าได้ โปรดลองใหม่ในภายหลัง')
          //this.$router.go(-1)
        })
    },
  },
}
</script>
