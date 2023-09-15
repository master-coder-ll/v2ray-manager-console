<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="200px">

      <el-form-item label="Имя сервера" prop="serverName">
        <el-input v-model="postForm.serverName" />
      </el-form-item>

      <el-form-item label="Домен" prop="clientDomain">
        <el-input v-model="postForm.clientDomain" />
      </el-form-item>

      <el-form-item label="Порт" prop="clientPort">
        <el-input v-model="postForm.clientPort" />
      </el-form-item>

      <el-form-item label="Поддержка TLS" prop="supportTLS">
        <el-radio-group v-model="postForm.supportTLS">
          <el-radio v-model="postForm.supportTLS" :label="true">Да</el-radio>
          <el-radio v-model="postForm.supportTLS" :label="false">Нет</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Proxy ip" prop="proxyIp">
        <el-input v-model="postForm.proxyIp" placeholder="127.0.0.1" />
      </el-form-item>
      <el-form-item label="Proxy порт" prop="proxyPort">
        <el-input v-model="postForm.proxyPort" />
      </el-form-item>
      <el-form-item label="v2ray ip" prop="v2rayIp">
        <el-input v-model="postForm.v2rayIp" placeholder="127.0.0.1" />
      </el-form-item>
      <el-form-item label="v2ray порт" prop="v2rayPort">
        <el-input v-model="postForm.v2rayPort" />
      </el-form-item>
      <el-form-item label="v2ray API порт" prop="v2rayManagerPort">
        <el-input v-model="postForm.v2rayManagerPort" />
      </el-form-item>
      <el-form-item label="Несколько трафиков" prop="Multiple">
        <el-input v-model="postForm.multiple" placeholder="1" />
      </el-form-item>
      <el-form-item label="v2rayTag" prop="inboundTag">
        <el-input v-model="postForm.inboundTag" />
      </el-form-item>
      <el-form-item label="ws путь" prop="wsPath">
        <el-input v-model="postForm.wsPath" placeholder="/ws/%s/" />
      </el-form-item>
      <el-form-item label="Описание услуг">
        <el-input v-model="postForm.desc" />
      </el-form-item>

      <el-form-item label="Level" prop="level">
        <el-select v-model="postForm.level">
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="alterId" prop="alterId">
        <el-input v-model="postForm.alterId" placeholder="версия v2ray>(4.35.0) равна 0" />
      </el-form-item>

      <el-form-item label="Состояние сервера" prop="status">
        <el-select v-model="postForm.status">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        Отправить
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { addServer, getServer, updateServer } from '@/api/server'
const defaultForm = {
  serverName: '',
  clientDomain: '',
  clientPort: 443,
  supportTLS: true,

  // управление промежуточным ПО прокси-сервера ip port;
  proxyIp: '127.0.0.1',
  proxyPort: 8091,
  // v2ray открываем IP и порт
  v2rayIp: '127.0.0.1',
  v2rayPort: 6001,
  v2rayManagerPort: 62789,
  // Несколько трафиков
  multiple: 1,

  // иллюстрировать
  desc: '',
  alterId: '0',
  // Состояние сервера
  status: 1,
  level: 0,
  inboundTag: '',
  // Максимальное количество подключений для одной учетной записи
  maxConnection: 100,
  // ws путь
  wsPath: '/ws/%s/'
}
const defaultRules = {
  serverName: { required: true, trigger: 'blur' },
  clientDomain: { required: true, trigger: 'blur' },
  clientPort: { required: true, trigger: 'blur' },
  supportTLS: { required: true, trigger: 'blur' },

  // proxy ip port;

  proxyIp: { required: true, trigger: 'blur' },
  proxyPort: { required: true, trigger: 'blur' },
  // v2ray открыть IP и порт
  v2rayIp: { required: true, trigger: 'blur' },
  v2rayPort: { required: true, trigger: 'blur' },
  v2rayManagerPort: { required: true, trigger: 'blur' },
  // Несколько трафиков
  multiple: { required: true, trigger: 'blur' },

  // иллюстрировать
  desc: '',
  // Состояние сервера
  status: { required: true, trigger: 'blur' },

  inboundTag: { required: true, trigger: 'blur' },
  // Максимальное количество подключений для одной учетной записи
  // maxConnection:{ required: true, trigger: 'blur' },
  // ws путь
  wsPath: { required: true, trigger: 'blur' }
}

export default {
  name: 'ServerDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: Object.assign({}, defaultRules),
      tempRoute: {},
      statusOptions: [{ value: 1, label: 'В сети' }, { value: 0, label: 'Не в сети' }],
      levelOptions: [{ value: 0, label: 'Уровень 0' }, { value: 1, label: 'Уровень 1' }, { value: 2, label: 'Уровень 2' }, { value: 3, label: 'Уровень 3' }]

    }
  },
  computed: {

  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      console.log('server get id ' + id)
      getServer(id).then(response => {
        this.postForm = response.obj
        this.postForm
      })
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          var req = this.isEdit ? updateServer(this.postForm) : addServer(this.postForm)
          req.then(response => {
            console.log('addserver chenggong !' + response)
            this.$notify({
              title: 'Успешно',
              message: 'Отправлено успешно',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
