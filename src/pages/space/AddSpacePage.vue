<template>
  <a-form layout="vertical" :model="formData" @finish="handleSubmit">
    <a-form-item label="空间名称" name="spaceName">
      <a-input v-model:value="formData.spaceName" placeholder="请输入空间名称" allow-clear />
    </a-form-item>
    <a-form-item label="空间级别" name="spaceLevel">
      <a-select
        v-model:value="formData.spaceLevel"
        :options="SPACE_LEVEL_OPTIONS"
        placeholder="请输入空间级别"
        style="min-width: 180px"
        allow-clear
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
        提交
      </a-button>
    </a-form-item>
  </a-form>
  <a-card title="空间级别介绍">
    <a-typography-paragraph>
      * 目前仅支持开通普通版，如需升级空间，请联系
      <a href="https://codefather.cn" target="_blank">程序员鱼皮</a>。
    </a-typography-paragraph>
    <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
      {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
      {{ spaceLevel.maxCount }}
    </a-typography-paragraph>
  </a-card>
</template>

<script setup lang="ts">
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { onMounted, reactive, ref } from 'vue'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet, updateSpaceUsingPost
} from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { formatSize } from '@/utils'

const formData = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})
const loading = ref(false)
const router = useRouter()
const spaceLevelList = ref<API.SpaceLevel[]>([])
const route = useRoute()
const oldSpace = ref<API.SpaceVo>()

const handleSubmit = async (values: any) => {
  const spaceId = route.query?.spaceId
  loading.value = true
  let res
  // 如果spaceId存在，则是更新
  if(spaceId){
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...formData,
    })
  }else {
    res = await addSpaceUsingPost({
      ...formData,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    router.push({
      path: `/space/${spaceId ?? res.data.data}`,
    })
  } else {
    message.error('操作失败' + res.data.message)
  }
  loading.value = false
}

const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('加载空间级别失败' + res.data.message)
  }
}

// 如果路由拿到spaceId
const fetchOldSpace = async () => {
  const spaceId = route.query?.spaceId
  if (spaceId) {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      oldSpace.value = data
      formData.spaceName = data.spaceName
      formData.spaceLevel = data.spaceLevel
    }
  }
}

onMounted(() => {
  fetchSpaceLevelList()
})

onMounted(() => {
  fetchOldSpace()
})
</script>

<style scoped></style>
