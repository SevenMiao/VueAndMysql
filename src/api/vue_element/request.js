import Vue from "vue";
/**
 * 新增数据
 * @param {*} module 模块名
 * @param {*} data 添加对象
 */
export function add(module, data) {
  return Vue.http.post(`/api/${module}/add`, data)
    .then((re) => {
      console.log("这是新增结果");
      console.log(re);
    });
}
/**
 * 新增数据
 * @param {*} module 模块名
 * @param {*} data 添加对象
 */
export function list(module, data) {
  return Vue.http.post(`/api/${module}/list`, data)
    .then((re) => {
      console.log("这是查询结果");
      console.log(re);
      return re;
    });
}