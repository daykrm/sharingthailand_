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
                ref="category"
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
            <v-row v-if="savedImg.length" class="text-center">
              <v-col v-for="(img, i) in savedImg" :key="i">
                <img
                  v-if="img.img"
                  :src="img.img"
                  width="250"
                  height="auto"
                /><br />
                <v-icon @click="deleteSavedImg(img.id)">mdi-close</v-icon>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            รูปสินค้า
            <!-- <v-file-input
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
            </v-file-input> -->
            <v-col
              v-show="$refs.upload && $refs.upload.dropActive"
              class="drop-active text-center"
            >
              <h3>Drop files to upload</h3>
            </v-col>
            <v-col style="background-color: #3e3e3e" class="text-center">
              <v-row v-if="files.length">
                <v-col v-for="(file, index) in files" :key="index">
                  <img
                    v-if="file.thumb"
                    :src="file.thumb"
                    width="250"
                    height="auto"
                  /><br />
                  <v-icon @click="deleteImg(index)">mdi-close</v-icon>
                </v-col>
              </v-row>
              <file-upload
                class="btn btn-primary"
                post-action="/upload/post"
                :multiple="true"
                :drop="true"
                :drop-directory="true"
                :maximum="limit"
                :value="files"
                v-model="files"
                @input-filter="inputFilter"
                ref="upload"
              >
                <v-btn color="blue-grey" class="ma-2 white--text">
                  เลือกไฟล์
                  <v-icon right dark> mdi-cloud-upload </v-icon>
                </v-btn>
              </file-upload>
            </v-col>
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
              <v-btn class="mt-4 ml-2" @click="initCreateTerm(attr)"
                >เพิ่ม{{ attr.term }}</v-btn
              >
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
                    <template v-for="(attr, key) in data.attr">
                      <td class="text-center" :key="key">{{ attr.name }}</td>
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
        <v-btn @click="cancelDialog = true">ลบสินค้า</v-btn>
        <v-btn @click="goBack" color="danger">ย้อนกลับ</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">เพิ่มประเภทสินค้า</v-col>
        </v-card-title>
        <v-card-text>
          <v-row @keyup.enter="createCategory">
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
          <v-btn color="teal lighten-1" @click="createCategory">บันทึก</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="termDialog" max-width="500px">
      <v-card>
        <v-overlay :value="loading" :absolute="absolute"></v-overlay>
        <v-card-title>
          <v-col class="text-center">เพิ่มลักษณะสินค้า</v-col>
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
    <v-dialog v-model="cancelDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-col class="text-center">ต้องการลบข้อมูลสินค้านี้ทั้งหมด ?</v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal lighten-1" @click="cancelDialog = false" text
            >ยกเลิก</v-btn
          >
          <v-btn color="teal lighten-1" @click="cancel">ยืนยัน</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import FileUpload from 'vue-upload-component'
export default {
  middleware: ['isNotAuth'],
  components: {
    FileUpload,
  },
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
    limit: function () {
      if (this.savedImg.length) return 4 - this.savedImg.length
      else return 4
    },
    limited: function () {
      if (this.savedImg.length) {
        if (this.savedImg.length == 4) {
          return true
        } else {
          return false
        }
      }
    },
  },
  data() {
    return {
      db: '',
      dialog: false,
      termDialog: false,
      cancelDialog: false,
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
        (files) => {
          return (
            !files ||
            !files.some((file) => file.size > 2097152) ||
            'รูปสินค้าต้องมีขนาดไม่เกิน 2 MB!'
          )
        },
      ],
      productAttr: [],
      product_name: '',
      details: '',
      allData: [
        {
          name: '',
          SKU: '',
          sell_price: 0,
          cost: 0,
          attr_details: [],
          status: 0,
        },
      ],
      parent_id: 1,
      insertData: {},
      useDraft: null,
      files: [],
      imgPath: [],
      savedImg: [],
      taxonomy: '',
      editedIndex: -1,
    }
  },
  async mounted() {
    this.db = await window.location.hostname.toString().split('.')[0]
    this.parent_id = (await this.$route.params.parent_id) || 0
    this.getCat()
    this.getAttr()
    await this.getImg()
    this.useDraft = await this.$route.params.draft
    if (this.$route.params.draft == 1) {
      await this.getProduct()
      this.allData.forEach((val) => {
        val.attr_details = JSON.parse(val.attr_details)
      })
    }
    //this.test(5)
  },
  methods: {
    getImg() {
      axios
        .get(`/api/product/img/${this.db}/img/${this.parent_id}`)
        .then((res) => {
          this.savedImg = res.data
        })
    },
    async deleteSavedImg(index) {
      await axios.delete(`/api/product/meta/byid/${this.db}/${index}`)
      this.getImg()
    },
    async saveProduct() {
      //await this.saveAttr()
      this.loading = true
      if (this.files.length) {
        if (this.savedImg.length + this.files.length > 4) {
          alert('ไม่สามารถเพิ่มรูปสินค้าได้ (มากสุด 4 รูป)')
          this.files = []
          this.loading = false
          return
        }
        let settings = { headers: { 'content-type': 'multipart/form-data' } }
        //await axios.delete(`/api/product/meta/${this.db}/img/${this.parent_id}`)
        var formData = new FormData()
        this.files.forEach(async (file, i) => {
          await formData.append('images', file.file)
        })
        await axios
          .post(`/api/upload`, formData, settings)
          .then((res) => {
            this.imgPath = res.data.images.split('|')
          })
          .catch((err) => {
            console.log(err)
          })
        await this.imgPath.forEach((img) => {
          axios.post(`/api/product/meta/${this.db}`, {
            //วน loop เพิ่มรูปภาพใน product_meta
            parent_id: this.parent_id,
            meta_key: 'img',
            meta_value: img,
          })
        })
      }
      await axios.post(`/api/product/meta/${this.db}`, {
        //เพิ่มหรือแก้ไข category ใน product_meta
        parent_id: this.parent_id,
        meta_key: 'category',
        meta_value: this.category,
      })
      await axios.delete(
        `/api/product/${this.db}/${this.parent_id}/${this.allData.length}`
      ) //ลบ Product ที่เกิน
      this.allData.forEach((val, i) => {
        this.insertData = {
          name: this.product_name,
          details: this.details,
          attr_details: val.attr_details,
          sell_price: val.sell_price,
          cost: val.cost,
          SKU: val.SKU,
          status: val.status,
          parent_id: this.parent_id,
          attr_index: i,
        }
        axios
          .post(`/api/product/${this.db}`, this.insertData) //วน loop เพิ่ม product
          .then((res) => {})
          .catch((err) => {
            alert('บันทึกล้มเหลว Error : ', err.response.data.message)
            return
          })
      })
      await this.getImg()
      this.files = []
      await alert('บันทึกข้อมูลสินค้าสำเร็จ')
      this.loading = await false
      this.$router.go(-1)
    },
    mergeData() {
      var totalRows = 1
      var totalAttr = 0
      var item = 0
      var items = 0
      var count = 0
      this.productAttr.forEach((val) => {
        if (val.selectTerm.length != 0) {
          totalAttr += 1
          totalRows = totalRows * val.selectTerm.length
        }
      })
      if (totalAttr != 0) {
        this.allData = []
        if (totalAttr == 1) {
          this.productAttr.forEach((val) => {
            val.selectTerm.forEach((term, i) => {
              this.allData[i] = {
                name: this.product_name,
                SKU: '',
                sell_price: 0,
                cost: 0,
                attr_details: [term],
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
                    sell_price: 0,
                    cost: 0,
                    attr_details: [val.selectTerm[item]],
                    status: 1,
                  }
                  items += 1
                  if (items == count) {
                    item += 1
                    items = 0
                  }
                  break
                } else {
                  this.allData[j].attr_details.push(val.selectTerm[item])
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
      } else {
        this.allData[0].name = this.product_name
      }
    },
    async saveAttr() {
      this.loading = true
      var Success = 0
      var Arr = []
      this.mergeData()
      axios.post(`/api/product/meta/${this.db}`, {
        parent_id: this.parent_id,
        meta_key: 'productAttr',
        meta_value: this.productAttr,
      })

      await this.productAttr.forEach((val) => {
        val.selectTerm.forEach((term) => {
          Arr.push(term.term_taxonomy_id)
        })
      })

      await axios
        .put(`/api/product/relation/${this.db}/${this.parent_id}`, {
          term: Arr,
        })
        .then(async (res) => {
          await this.productAttr.forEach((val) => {
            val.selectTerm.forEach((term) => {
              //Arr.push(term.term_taxonomy_id)
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
                  //return
                })
            })
          })
        })
        .catch((errs) => {
          alert('บันทึกล้มเหลว Error: ', errs.response.data.message)
          //return
        })
      //alert('บันทึกลักษณะสินค้าสำเร็จ')
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
      await axios
        .get(`/api/product/${this.db}/${this.parent_id}`)
        .then(async (res) => {
          this.product_name = res.data[0].name
          this.details = res.data[0].details
          this.allData = res.data
          if (this.allData[0].attr_details.length != 0) {
            axios
              .get(`/api/product/meta/${this.db}/productAttr/${this.parent_id}`)
              .then(async (result) => {
                //console.log(res.data[0].meta_value);
                this.productAttr = await JSON.parse(result.data[0].meta_value)
                await this.productAttr.forEach((val, i) => {
                  axios
                    .get(`/api/product/term/${this.db}/${val.data[0].taxonomy}`)
                    .then(async (term) => {
                      this.productAttr[i].data = await term.data.data
                      //console.log(term.data.data)
                    })
                })
              })
            axios
              .get(`/api/product/meta/${this.db}/category/${this.parent_id}`)
              .then((result) => {
                //console.log(res.data[0].meta_value);
                this.category = JSON.parse(result.data[0].meta_value)
              })
          }
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
    goBack() {
      this.$router.go(-1)
    },
    cancel() {
      axios
        .delete(`/api/product/meta/${this.db}/${this.parent_id}`)
        .then((data) => {
          axios
            .delete(`/api/product/relation/${this.db}/${this.parent_id}`)
            .then((res) => {
              axios
                .delete(`/api/product/${this.db}/${this.parent_id}/0`)
                .then((response) => {
                  this.$cookies.remove('draft')
                  this.$router.go(-1)
                })
                .catch((err) => {
                  //this.$router.go(-1)
                  alert('1')
                })
            })
            .catch((error) => {
              //this.$router.go(-1)
              alert('2')
            })
        })
        .catch((errs) => {
          //this.$router.go(-1)
          alert(errs.response.data.message)
        })
    },
    close() {
      this.catName = ''
      this.catSlug = ''
      this.editedIndex = -1
      this.dialog = false
      this.termDialog = false
    },
    deleteChip(index, text) {
      // Prompt here with text if required
      this.product_img.splice(index, 1)
    },
    createCategory() {
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
    initCreateTerm(attr) {
      this.termDialog = true
      this.selectAttr = attr.data[0].taxonomy
      this.editedIndex = this.productAttr.indexOf(attr)
      //console.log('index of term',this.selectAttr);
    },
    createTerm() {
      this.loading = true
      const data = {
        name: this.catName,
        slug: this.catSlug,
      }
      axios
        .post(`/api/product/term/${this.db}/${this.selectAttr}`, data)
        .then(async (res) => {
          if (res.status == 200) {
            await axios
              .get(`/api/product/term/${this.db}/${this.selectAttr}`)
              .then((term) => {
                this.productAttr[this.editedIndex].data = term.data.data
              })
            await this.close()
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
    deleteImg(index) {
      this.files.splice(index, 1)
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        // 自动压缩
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === 'image/' &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = 'compressing'
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512,
          })
          imageCompressor
            .compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, {
                error: '',
                file,
                size: file.size,
                type: file.type,
              })
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, {
                error: err.message || 'compress',
              })
            })
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
  },
}
</script>
<style>
.example-drag label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.example-drag .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.img_wrp {
  display: inline-block;
  position: relative;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
