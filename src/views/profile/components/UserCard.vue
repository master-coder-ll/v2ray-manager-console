<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>

      </div>
    </div>
<div class="user-bio">
    <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="edit" /><span>修改密码</span></div>
          <el-form  :model="postForm" :rules="rules" ref="postForm">
            <el-form-item label="原密码" prop="oldPassword" ><el-input placeholder="原密码" show-password v-model="postForm.oldPassword"></el-input></el-form-item>
            <el-form-item  label="新密码" prop="newPassword"><el-input placeholder="新密码" show-password  v-model="postForm.newPassword"></el-input></el-form-item>
          
              <el-form-item>
               
                 <el-button @click="chPw()" >提交</el-button>
                 </el-form-item>
            
          </el-form>
      </div>
</div>
    <!-- <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Education</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div> -->
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import md5 from 'js-md5'
import { changepassword } from '@/api/user'
export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: '',
         
        }
      }
    }
  },data(){
    return{
    postForm: {},
    rules:{
        oldPassword: { required: true, min: 6, trigger: 'blur' },
        newPassword: { required: true, min: 6, trigger: 'blur' },
    }
  }
  },methods:{
    chPw(){

          this.$confirm(' 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$refs.postForm.validate(valid =>{
          if(valid){
            var data= {oldPassword:md5(this.postForm.oldPassword),newPassword:md5(this.postForm.newPassword)};
            changepassword(data).then(response =>{
             this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
              
            })

          }else{
          
          return false
          }
              })

        }).catch(() => {
          
        });
      
      
     
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
