<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">เพิ่มสินค้า</v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            ประเภทสินค้า
            <v-row>
              <v-select
                :items="categoryItems"
                item-text="name"
                item-value="term_id"
                v-model="category"
                multiple
                chips
                deletable-chips
                clearable
                label="เลือกประเภทสินค้า"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="toggle">
                    <v-list-item-action>
                      <v-icon
                        :color="category.length > 0 ? 'indigo darken-4' : ''"
                      >
                        {{ icon }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title> Select All </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
              <v-btn class="mt-4 ml-2" @click="dialog = true"
                >เพิ่มประเภทสินค้า</v-btn
              >
            </v-row>
          </v-col>
          <v-col cols="12">
            รูปสินค้า
            <v-file-input
              :rules="rules"
              label="รูปสินค้า"
              v-model="product_img"
              chips
              small-chips
              outlined
              dense
              multiple
              show-size
              prepend-icon="mdi-camera"
              accept="image/png, image/jpeg, image/bmp"
            >
              <template v-slot:selection="{ index, text }">
                <v-chip
                  small
                  close
                  color="primary"
                  @click:close="deleteChip(index, text)"
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <small
              >รูปหลักในหน้าสินค้า มากสุด 4 รูป ขนาด 330 x 330 - 5000 x 5000
              px</small
            >
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="product_name"
              label="ชื่อสินค้า"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="รายละเอียด"></v-text-field>
          </v-col>
          <v-col cols="12">
            ลักษณะสินค้า
            <v-row>
              <v-select
                :items="attrItems"
                item-text="attr_label"
                item-value="attr_name"
                v-model="selectAttr"
                label="เลือกลักษณะสินค้า"
              ></v-select>
              <v-btn class="mt-4 ml-2" @click="addAttrToProduct">เพิ่ม</v-btn>
            </v-row>
            <v-row
              v-if="productAttr.length != 0"
              v-for="attr in productAttr"
              :key="attr.term"
            >
              {{ attr.term }}
              <v-select
                :items="attr.data"
                item-text="name"
                item-value="term_id"
                multiple
                chips
                deletable-chips
                clearable
                v-model="attr.selectTerm"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="selectAll(attr)">
                    <v-list-item-action>
                      <v-icon
                        :color="
                          attr.selectTerm.length > 0 ? 'indigo darken-4' : ''
                        "
                      >
                        {{ attr.icon }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title> Select All </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-row>
            <v-col class="text-center">
              <v-btn @click="mergeData">บันทึกลักษณะสินค้า</v-btn>
            </v-col>
          </v-col>
          <v-col cols="12">
            <v-simple-table v-if="productAttr.length != 0">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">ชื่อสินค้า</th>
                    <th class="text-center">SKU</th>
                    <template v-for="attr in productAttr">
                      <th :key="attr.term">{{ attr.term }}</th>
                    </template>
                    <th class="text-center">ต้นทุน</th>
                    <th class="text-center">ราคาขาย</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="text-center">
        <v-btn color="primary"> บันทึก </v-btn>
        <v-btn @click="cancel">ยกเลิก</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">เพิ่มประเภทสินค้า</v-col>
        </v-card-title>
        <v-card-text>
          <v-row @keyup.enter="createTerm">
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
  computed: {
    selectAllCategory() {
      return this.category.length === this.categoryItems.length
    },
    selectSomeCategory() {
      return this.category.length > 0 && !this.selectAllCategory
    },
    icon() {
      if (this.selectAllCategory) return 'mdi-close-box'
      if (this.selectSomeCategory) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  data() {
    return {
      db: window.location.hostname.toString().split('.')[0],
      dialog: false,
      catName: '',
      catSlug: '',
      categoryItems: [],
      attrItems: [],
      selectAttr: '',
      loading: false,
      absolute: true,
      category: [],
      product_img: null,
      rules: [
        (files) =>
          !files ||
          !files.some((file) => file.size > 2_097_152) ||
          'รูปสินค้าต้องมีขนาดไม่เกิน 2 MB!',
      ],
      productAttr: [],
      product_name: '',
      allData : []
    }
  },
  mounted() {
    this.getCat()
    this.getAttr()
  },
  methods: {
    mergeData() {
        //alert('ok')
        this.productAttr.forEach(val => {
            val.selectTerm.forEach(select => {
                this.allData.push({ name : '',term : select })
            })
        })
    },
    selectAll(attr) {
      if (attr.selectTerm.length == attr.data.length) {
        attr.selectTerm = []
        attr.icon = 'mdi-checkbox-blank-outline'
      } else {
        attr.selectTerm = attr.data.slice()
        attr.icon = 'mdi-minus-box'
      }
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAllCategory) {
          this.category = []
        } else {
          this.category = this.categoryItems.slice()
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    close() {
      this.catName = ''
      this.catSlug = ''
      this.dialog = false
    },
    deleteChip(index, text) {
      // Prompt here with text if required
      this.product_img.splice(index, 1)
    },
    createTerm() {
      this.loading = true
      const data = {
        name: this.catName,
        slug: this.catSlug,
      }
      axios
        .post(`/api/product/term/${this.db}/category`, data)
        .then((res) => {
          if (res.status == 200) {
            this.getCat()
            this.category.push(res.data.id)
            this.close()
            this.loading = false
          }
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    getCat() {
      axios.get(`/api/product/term/${this.db}/category`).then((res) => {
        this.categoryItems = res.data
      })
    },
    getAttr() {
      axios.get(`/api/product/attr/${this.db}`).then((res) => {
        this.attrItems = res.data
      })
    },
    addAttrToProduct() {
      var term = this.selectAttr
      axios
        .get(`/api/product/term/${this.db}/${term}`)
        .then((res) => {
          console.log(res.data)
          this.productAttr.push(res.data)
        })
        .catch((err) => {
          //this.productAttr.push
        })
    },
  },
}
</script>
