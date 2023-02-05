//步驟：
//1.先將html跟大致的css架出來（bs5)塞到模板裡
//2. export default到主js中，區域註冊
//3. 在主html中呼叫出該元件（目的：先確認畫面沒問題）
//4. 確認api資料顯示，將所有產品的api url改成分頁產品的
//5. 因為getData寫在根元件，所以要利用prop將該方法傳入本子元件
export default {
    props:['pagination'],
    //bs5: 分頁active跟disabled樣式
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled:!pagination.has_pre }">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{ active: page === pagination.current_page}" v-for="page in pagination.total_pages" :key="page + 'page'">
      <a class="page-link" href="#" @click.prevent="$emit('change-page',page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled:!pagination.has_next }">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}