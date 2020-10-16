<template>
  <div>
    <v-row>
      <v-overlay :value="loading" :absolute="absolute"></v-overlay>
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
            <v-text-field v-model="details" label="รายละเอียด"></v-text-field>
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
                return-object
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
              <v-btn @click="saveAttr">บันทึกลักษณะสินค้า</v-btn>
            </v-col>
          </v-col>
          <v-col cols="12">
            <v-simple-table
              v-if="productAttr.length != 0 || allData.length != 0"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">ชื่อสินค้า</th>
                    <th class="text-center">SKU</th>
                    <template v-for="attr in productAttrs">
                      <th class="text-center" :key="attr.term">
                        {{ attr.term }}
                      </th>
                    </template>
                    <th class="text-center">ต้นทุน</th>
                    <th class="text-center">ราคาขาย</th>
                    <th class="text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, i) in allData" :key="i">
                    <td class="text-center">
                      <v-text-field v-model="data.name"></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-text-field v-model="data.SKU"></v-text-field>
                    </td>
                    <template v-for="(attr, key) in data.Attr">
                      <td class="text-center" :key="key">{{ attr }}</td>
                    </template>
                    <td class="text-center">
                      <v-text-field v-model="data.cost"></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-text-field v-model="data.sell_price"></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-switch
                        v-model="data.status"
                        color="success"
                        hide-details
                        :false-value="0"
                        :true-value="1"
                      ></v-switch>
                    </td>
                  </tr>
                </tbody>
                <tbody></tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="text-center">
        <v-btn color="primary" @click="saveProduct"> บันทึก </v-btn>
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
    productAttrs: function () {
      return this.productAttr.filter((val) => {
        return val.selectTerm.length > 0
      })
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
      product_name: 'testName',
      details: '',
      allData: [],
      parent_id: 1,
      insertData: {},
    }
  },
  async mounted() {
    this.parent_id = (await this.$route.params.parent_id) || 0
    this.getCat()
    this.getAttr()
    if (this.$route.params.draft == 1) {
      this.getProduct()
    }
    //this.test(5)
  },
  methods: {
    async saveProduct() {
      this.loading = true
      await axios.delete(`/api/product/${this.db}/${this.parent_id}`)
      this.allData.forEach((val) => {
        this.insertData = {
          name: val.name,
          details: this.details,
          attr_details: val.Attr,
          sell_price: val.sell_price,
          cost: val.cost,
          SKU: val.SKU,
          status: val.status,
          parent_id: this.parent_id,
        }
        axios
          .post(`/api/product/${this.db}`, this.insertData)
          .then((res) => {})
          .catch((err) => {
            alert('บันทึกล้มเหลว Error : ', err.response.data.message)
            return
          })
      })
      await alert('เพิ่มข้อมูลสำเร็จ')
      this.loading = false
    },
    mergeData() {
      var totalRows = 1
      var totalAttr = 0
      var item = 0
      var items = 0
      var count = 0
      this.allData = []
      this.productAttr.forEach((val) => {
        if (val.selectTerm.length != 0) {
          totalAttr += 1
          totalRows = totalRows * val.selectTerm.length
        }
      })
      if (totalAttr == 0) {
        this.allData[0] = {
          name: this.product_name,
          SKU: '',
          sell_price: '',
          cost: '',
        }
      } else if (totalAttr == 1) {
        this.productAttr.forEach((val) => {
          val.selectTerm.forEach((term, i) => {
            this.allData[i] = {
              name: this.product_name,
              SKU: '',
              sell_price: '',
              cost: '',
              Attr: [term.name],
              status: 1,
            }
          })
        })
      } else {
        this.productAttr.forEach((val, i) => {
          if (i == 0) {
            count = totalRows / val.selectTerm.length
            console.log()
          } else {
            count = count / val.selectTerm.length
            console.log(count)
          }
          for (let j = 0; j < totalRows; j++) {
            while (item < val.selectTerm.length) {
              if (i == 0) {
                this.allData[j] = {
                  name: this.product_name,
                  SKU: '',
                  sell_price: '',
                  cost: '',
                  Attr: [val.selectTerm[item].name],
                  status: 1,
                }
                items += 1
                if (items == count) {
                  item += 1
                  items = 0
                }
                break
              } else {
                this.allData[j].Attr.push(val.selectTerm[item].name)
                items += 1
                if (items == count) {
                  item += 1
                  items = 0
                  if (item == val.selectTerm.length) {
                    item = 0
                  }
                }

                break
              }
            }
          }
          item = 0
          items = 0
        })
      }
    },
    saveAttr() {
      this.loading = true
      var Success = 0
      this.mergeData()
      axios
        .delete(`/api/product/meta/${this.db}/productAttr/${this.parent_id}`)
        .then((data) => {
          axios
            .delete(`/api/product/relation/${this.db}/${this.parent_id}`)
            .then(async (res) => {
              await axios.post(`/api/product/meta/${this.db}`, {
                parent_id: this.parent_id,
                meta_key: 'productAttr',
                meta_value: this.productAttr,
              })
              console.log(this.productAttr)
              await this.productAttr.forEach((val) => {
                val.selectTerm.forEach((term) => {
                  axios
                    .post(`/api/product/relation/${this.db}`, {
                      parent_id: this.parent_id,
                      term_taxonomy_id: term.term_taxonomy_id,
                    })
                    .then((result) => {
                      Success = 1
                    })
                    .catch((err) => {
                      alert('บันทึกล้มเหลว Error: ', err.response.data.message)
                      return
                    })
                })
              })
            })
            .catch((error) => {
              alert('บันทึกล้มเหลว Error : ', err.response.data.message)
              return
            })
        })
        .catch((errs) => {
          alert('บันทึกล้มเหลว Error : ', err.response.data.message)
          return
        })
      alert('บันทึกสำเร็จ')
      this.loading = false
    },
    updateProduct() {
      const data = {
        name: this.product_name,
        details: this.details,
        sell_price: 0,
        cost: 0,
      }
    },
    async getProduct() {
      await axios.get(`/api/product/${this.db}/${this.parent_id}`).then((res) => {
        this.product_name = res.data[0].name
        this.details = res.data[0].details
        this.allData = res.data
      })
      await axios
        .get(`/api/product/meta/${this.db}/productAttr/${this.parent_id}`)
        .then((res) => {
          //console.log(res.data[0].meta_value);
          this.productAttr = JSON.parse(res.data[0].meta_value)
        })
      //this.mergeData()
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
      axios
        .delete(`/api/product/meta/${this.db}/${(this, this.parent_id)}`)
        .then((data) => {
          axios
            .delete(`/api/product/relation/${this.db}/${this.parent_id}`)
            .then((res) => {
              axios
                .delete(`/api/product/${this.db}/${this.parent_id}`)
                .then((response) => {
                  this.$router.go(-1)
                })
                .catch((err) => {
                  this.$router.go(-1)
                })
            })
            .catch((error) => {
              this.$router.go(-1)
            })
        })
        .catch((errs) => {
          this.$router.go(-1)
        })
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
          if (
            this.productAttr.filter((e) => e.term === res.data.term).length == 0
          ) {
            this.productAttr.push(res.data)
          }
        })
        .catch((err) => {
          //this.productAttr.push
        })
    },
  },
}
</script>
