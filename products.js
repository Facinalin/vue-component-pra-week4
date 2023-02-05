import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import paginationComponent from './components/pagination.js';
import productModalComponent from './components/productModal.js';
import delModalComponent from './components/delProductModal.js';


let productModal = null;
let delProductModal = null;

//放在後台根元件的：user一刷新會看到的
//產品資料/ api路徑/ 暫存tempProduct/ 產品列表分頁/ 是否為編輯or新增產品
//注意結構：根元件的下一層就是各個元件（pagination元件/ deleteModal元件/ productModal元件，所以只會使用到prop跟emit，不是多層巢狀結構，故不需使用provide跟inject的組合）
const app =createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'lk1025cina',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      //因為
      pagination: {},
      isNew: false,
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
  //區域註冊（通常import都會這樣寫）
  components:{
    paginationComponent,
    productModalComponent,
    delModalComponent
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    //Default值先給1，讓分頁停在第一頁
    getData(page = 1) {
      //小知識：以本課程api來說，決定一頁有幾個產品是後端設定的，前端無法更改。替代方案：用all api前端自己寫條件分成幾頁
      //這個url更動history:原本有all，但為了分頁拿掉all，改成?page=指定頁數
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((response) => {
          //Remember:不管是取所有產品or取分頁產品都是從response.data取，所以可以直接以解構方式撰寫
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        //淺拷貝一樣是為了避免畫面一邊被同步更新
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
        if(this.tempProduct.hasOwnProperty('imagesUrl')){
          let testBlank = this.tempProduct.imagesUrl.filter(item => item === '');
          // if(testBlank.length !== 0){
          //   console.log('需要清理')
          // }
        }else{
          console.log('沒有這屬性喔')
        }
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  },
});

// 產品新增/編輯元件
// app.component('productModal', {
//   template: '#product-modal-template',
//   props: ['product', 'isNew'],
//   data() {
//     return {
//       apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//       apiPath: 'lk1025cina',
//     };
//   },
//   mounted() {
//     productModal = new bootstrap.Modal(document.getElementById('productModal'), {
//       keyboard: false,
//       backdrop: 'static'
//     });
//   },
//   methods: {
//     updateProduct() {
//       // 新增商品
//       let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
//       let httpMethod = 'post';
//       // 當不是新增商品時則切換成編輯商品 API
//       if (!this.isNew) {
//         api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
//         httpMethod = 'put';
//       }

//       axios[httpMethod](api, { data: this.product }).then((response) => {
//         alert(response.data.message);
//         this.hideModal();
//         //下面這句目標：想要觸發getData方法，但因為該方法儲存在根元件，所以要emit出去向父層要方法。
//         //html78跟79行：因為（修改+編輯）或（刪除）都會需要再調用getData所以要寫在html那邊（如果已拆成元件的話就是網往template找）
//         this.$emit('update');
//         //預設：如果沒有多張圖片，則沒有imagesUrl這個屬性
//       }).catch((err) => {
//         alert(err.response.data.message);
//       });
//     },
//     createImages() {
//       this.product.imagesUrl = [];
//       this.product.imagesUrl.push('');
//     },
//     openModal() {
//       productModal.show();
//     },
//     hideModal() {
//       productModal.hide();
//     },
//   },
// })
// 產品刪除元件
// app.component('delProductModal', {
//   template: '#delProductModal',
//   props: ['item'], //app為他的父層
//   data() {
//     return {
//       apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//       apiPath: 'lk1025cina',
//     };
//   },
//   mounted() {
//     //delProductModal在根元件外宣告，但在各自的元件生命週期中重新賦予值
//     delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
//       keyboard: false,
//       backdrop: 'static',
//     });
//   },
//   methods: {
//     delProduct() {
//       axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
//         this.hideModal();
//         //下面這行：重新get一次data
//         this.$emit('update');
//       }).catch((err) => {
//         alert(err.response.data.message);
//       });
//     },
//     openModal() {
//       delProductModal.show();
//     },
//     hideModal() {
//       delProductModal.hide();
//     },
//   },
// });

app.mount('#app');