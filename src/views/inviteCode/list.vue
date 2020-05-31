<template>
  <div class="app-container">
    <el-row><el-button  @click="dialogVisible = true" type="primary" plain>->生成邀请码 </el-button></el-row>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="邀请码">
        <template slot-scope="scope">
          <span>{{ scope.row.inviteCode }}</span>
        </template>
      </el-table-column>

       <el-table-column  align="center" label="使用用户">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column> 
     <el-table-column  align="center" label="有效时间">
        <template slot-scope="scope">
          <div v-if="scope.row.effectiveTime !=null"> 
           <font v-if="scope.row.effectiveTime<new Date().getTime()" color="red" >
              {{ scope.row.effectiveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
           </font>
           <font v-else>  {{ scope.row.effectiveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</font>
           </div>
        </template>
      </el-table-column> 
     
      <el-table-column  align="center" label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status |statusFilter2 }}
          </el-tag>
        </template>
      </el-table-column>
            <el-table-column  align="center" label="操作">
        <template slot-scope="{row}">
      
           <el-button @click="handleDelete(row.id)">删除</el-button>

        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="Actions" width="241">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

      <el-dialog
  title="生成邀请码"
  :visible.sync="dialogVisible" > 
  <!-- :before-close="handleClose"-->
 
  
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="100px">

      <el-form-item label="数量" prop="quantity">
        <el-input-number :min="1" :max="100" label="数量" v-model="postForm.quantity"  />
      </el-form-item>

      <el-form-item label="有效时间" prop="effectiveTime">
        <el-date-picker
      v-model="postForm.effectiveTime"
      type="date"
       value-format="timestamp"
      placeholder="选择日期">
    </el-date-picker>
      </el-form-item>
    </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handlerGenerate()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { list, generate, del } from '@/api/inviteCode'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { date } from 'jszip/lib/defaults'

  var checkDate = (rule, value, callback) => {
          if(value){
              console.log("value:"+ value)
              if(value<new Date().getTime()){
                 callback(new Error("请选择大于当前时间的的日期"))
                 return
              }
            callback()
          }else{
            callback(new Error("请选择日期"))
          }
      };
const defaultRules = {
  quantity: { required: true, trigger: 'blur' },
  effectiveTime: { validator:checkDate, trigger: 'blur' },
}
const defaultForm = {
  quantity: 1,
  effectiveTime: null
}
export default {
  name: 'inviteCodeList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': 'success',
        '1': 'danger'
      }
      return statusMap[status]
    },
    statusFilter2(status) {
      const statusMap = {
        '1': '已使用',
        '0': '未使用'
      }
      return statusMap[status]
    }
  },
  data() {
     
    return {
      postForm: Object.assign({}, defaultForm),
      rules: Object.assign({}, defaultRules),
      dialogVisible:false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      }
      
    }
  },
  created() {
    this.getList()
  },
  methods: {
     handlerGenerate() {
           this.$refs.postForm.validate(valid => {
        
        if (valid) {

     generate(this.postForm).then(() => {
          this.$message({
            type: 'success',
            message: '生成成功!'
          })
         this.dialogVisible=false;
          this.getList();
      }  )

        }else {
          return false;
        }
        })
  
   
   },
    handleDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.obj.content
        this.total = response.obj.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
