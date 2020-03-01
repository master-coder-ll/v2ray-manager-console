<template>
  <div class="dashboard-editor-container">
        <github-corner class="github-corner" />
    <el-row :gutter="10">
        <el-card>
           <el-tabs v-model="activeTab">
           <el-tab-pane label="公告" name="Notice">
                <Notice />
              </el-tab-pane>
              <el-tab-pane label="知识" name="knowledge">
               todo
              </el-tab-pane>
              <!-- 
              <el-tab-pane label="Account" name="account">
                 <timeline />
                <account :user="user" />
              </el-tab-pane>  -->
            </el-tabs>
          </el-card>
    </el-row>
  <!-- <el-row>
    <h3>公告</h3>
  </el-row>
    <el-row>
      <el-collapse v-model="activeNames">
      
        <div v-for=" (item,index) in list" :key="index">
      <el-collapse-item :title="item.name" :name="index" >
       <div v-html="item.content" />
      </el-collapse-item>
      </div>
   
  
  
</el-collapse>
    </el-row> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
// import GithubCorner from '@/components/GithubCorner'

import GithubCorner from '@/components/GithubCorner'
import Notice from './components/Notice'
export default {
  name: 'DashboardEditor',
  components: { PanThumb,GithubCorner,Notice },
  data() {
    return {
      activeNames: 0,
      list:null,
      activeTab:"Notice"
    }
  },
  created(){
      // listNotice().then(response =>{
      //      this.list= response.obj
      //      this.activeNames=0;
      // })
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" >

.github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
 

  .dashboard-editor-container {
   // background-color: #e3e3e3;
     a, a:focus, a:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: none;
}
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
   
  

  }
</style>
