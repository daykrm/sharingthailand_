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
export default {
  data() {
    return {
      filter: '',
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
  methods : {
      addProduct(){
          this.$router.push({path:'/Marketing/Product/create'})
      }
  }
}
</script>
