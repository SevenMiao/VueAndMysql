<template>
  <section>
    <el-button @click="handleOpen('add')">新增</el-button>
    <list-table :btn-show="btnShow" :formatter-columns="formatterColumns" :is-refresh="child.refreshList" :content="child.childContent" @delete="handleDeleteRow" @edit="handleEditRow"/>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" title="新增经历" width="770px">
      <el-form :model="model">
        <el-form-item label="标题">
          <el-input v-model="model.title" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="model.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="标签">
          <edit-tags :dynamic-tags.sync="dynamicTags"></edit-tags>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="model.description" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="感想或收获">
          <el-input v-model="model.thoughts" clearable placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddOk">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";

import { cloneDeep } from "lodash";

import ListTable from "@/components/ListTable";
import EditTags from "@/components/Assembly/EditTags";

import { add, update, deleteById } from "@/api/vue_element/request";

import { dateFormatByCustomFormat, objectKeyTitleCase } from "@/utils/format"

const modelData = {
  title: "",
  date: "",
  tag: "",
  description: "",
  thoughts: ""
};
export default {
  name: "GeRenJingLi",
  components: {
    ListTable,
    EditTags
  },
  data() {
    return {
      child: {
        refreshList: false,
      childContent: "myExperience"
      },
      btnShow: {
        delete: true,
        edit: true
      },
      dialogVisible: false,
      dynamicTags: [],
      model: {},
      changeModel: {}
    };
  },
  computed: {
    ...mapGetters(["currentAccount"]),
    /**
     * 列的格式化
     */
    formatterColumns: function() {
      return {
        columns: ["Date"],
        functions: [this.dateFormatByCustomFormat]
      }
    }
  },
  methods: {
    /**
     * 查询数据
     */
    getList: function() {
      console.log(this.currentAccount);
      console.log(this.$store.state.user.currentAccount);
      console.log(ListTable.methods.refresh);
      ListTable.methods.refresh(this.childContent);
    },
    /**
     * 编辑数据
     */
    handleEditRow: function(row, index) {
      console.log("编辑数据");
      console.log("row");
      console.log(row);
      console.log("index");
      console.log(index);
      this.handleOpen("edit", row);
    },
    /**
     * 删除数据
     */
    handleDeleteRow: function(row, index) {
      console.log("删除数据");
      console.log("row");
      console.log(row);
      console.log("index");
      console.log(index);
deleteById("experience", row.id || row.Id).then(v => {
  this.child.refreshList = !this.child.refreshList;
})
    },
    /**
     * 打开弹窗
     */
    handleOpen: function(type, changeItem) {
      this.dynamicTags = [];
      switch (type) {
        case "add":
          this.model = cloneDeep(modelData);
          break;
        default:
           Object.keys(changeItem).forEach(v => {
        if(v && v.charAt(0)) {
          v = v.charAt(0).toLowerCase() + v.substring(1);
        }
      });
          this.model = Object.assign({},  objectKeyTitleCase(changeItem));
          this.dynamicTags = changeItem.Tag.split(",");
          break;
      }
      this.dialogVisible = true;
    },
    /**
     * 新增内容点击确定
     */
    handleAddOk: function() {
      this.model.tag = this.dynamicTags.join(",");
      Promise.resolve().then(_ => {
      if(this.model.id) {
        update("experience", this.model);
      } else {
        add("experience", this.model);
      }
      }).then(_ => {
        // 刷新查询页面
  this.child.refreshList = !this.child.refreshList;
      })
      this.dialogVisible = false;
    },
    /**
     * 格式化时间
     */
    dateFormatByCustomFormat(value) {
      return dateFormatByCustomFormat(value, "YYYY年MM月DD日")
    }
  }
}
</script>

