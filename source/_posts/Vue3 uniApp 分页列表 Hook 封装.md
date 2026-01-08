---
title: Vue3 uniApp 分页列表 Hook 封装 - usePaginationList
date: 2025-01-19 14:24
updated: 2025-01-19 14:24
tags:
  - Vue
  - uni-app
  - JavaScript
categories:
  - Vue
toc: true
excerpt: 一个功能完善的 Vue3 分页列表 Hook，支持 UniApp 小程序及 Web 端，集成了自动加载、下拉刷新、触底加载、筛选重置及状态管理。
---

## 简介

`usePaginationList` 是一个用于处理分页列表数据的 Vue3 Composition API Hook。它封装了分页加载、状态管理、错误处理等常见逻辑。不仅适用于 Web 端，针对 **UniApp 小程序** 的下拉刷新和触底加载场景也做了适配。

## 功能特性

- ✅ **多端适配**：支持 Web 及 UniApp 小程序
- ✅ **状态管理**：内置 loading、noData (暂无数据)、pageEnd (到底了) 状态
- ✅ **筛选重置**：支持传入搜索条件并自动重置分页
- ✅ **生命周期**：支持 `onSuccess` 和 `onError` 回调（常用于停止下拉刷新动画）
- ✅ **灵活配置**：可配置分页字段名、初始参数、是否立即加载等

## 参数说明

### fetchFunction (必需)
数据请求函数，接收合并后的参数对象，返回 Promise。接口返回的数据结构应包含：
- `list` 或 `data.list`: 列表数据数组
- `total` 或 `data.total`: 总条目数（可选）
- `pages` 或 `data.pages`: 总页数（可选）

### options (可选)
配置对象，包含以下属性：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pageSize` | `number` | `15` | 每页显示数量 |
| `immediate` | `boolean` | `true` | 是否在初始化时立即执行一次加载 |
| `extraParams` | `object` | `{}` | 固定的额外请求参数，会与分页参数合并 |
| `pageField` | `string` | `'current'` | 后端接口分页参数：页码的字段名 |
| `pageSizeField` | `string` | `'limit'` | 后端接口分页参数：每页数量的字段名 |
| `onSuccess` | `function` | - | 请求成功时的回调函数 (可处理 `uni.stopPullDownRefresh`) |
| `onError` | `function` | - | 请求失败时的回调函数 |

## 返回值

返回一个对象，包含以下属性和方法：

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `list` | `Ref<Array>` | 列表数据 |
| `loading` | `Ref<boolean>` | 是否处于加载状态 |
| `pageEnd` | `Ref<boolean>` | 是否已加载所有数据 |
| `noData` | `Ref<boolean>` | 是否无数据（第一页就没有数据） |
| `total` | `Ref<number>` | 数据总条目数 |
| `pages` | `Ref<number>` | 总页数 |
| `currentPage` | `Ref<number>` | 当前页码 |
| `error` | `Ref<Error\|null>` | 错误对象 |
| `params` | `Ref<object>` | 当前请求的参数对象 |
| `getList` | `function` | 加载数据函数，可手动触发加载 |
| `reset` | `function` | 重置列表状态并重新加载数据 (常用于搜索) |
| `setPage` | `function` | 跳转到指定页并重新加载 |

## 使用示例 (UniApp + Wot Design)

以下示例展示了如何在 UniApp 组件中使用该 Hook，配合 `wd-status-tip` (缺省页) 和 `wd-loadmore` (加载更多)，并暴露方法给父页面处理触底事件。

```javascript
<template>
  <wd-status-tip
    v-if="list.length == 0 && !loading"
    image="[https://example.com/empty.png](https://example.com/empty.png)"
    tip="暂无内容"
  />
  
  <template v-else>
    <view class="user-card-item" v-for="(item, index) in list" :key="item.id">
      <view class="user-info-section">
        <image class="avatar" :src="item.avatar" />
        <view class="info-text">
          <view class="name-title">{{ item.nickName }}</view>
          <text>{{ item.userPhoneNumber }}</text>
        </view>
      </view>
    </view>
  </template>

  <wd-loadmore v-if="loading" custom-class="loadmore" state="loading" />
  
  <wd-loadmore v-if="!loading && pageEnd && list.length > 10" custom-class="loadmore" state="finished" />
</template>

<script setup>
import { reactive, watch, getCurrentInstance, defineExpose, defineModel } from 'vue';
import { usePaginationList } from '@/hooks/usePaginationList';

const { proxy } = getCurrentInstance();
const totalLength = defineModel(); // 双向绑定总数给父组件

// 1. 定义 API 请求函数
async function getMyTeamList(requestParams) {
  return new Promise((resolve, reject) => {
    proxy.$api.health.getMyTeamList(requestParams)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

// 2. 初始化 Hook
const {
  list,
  loading,
  pageEnd,
  noData,
  total,
  getList,
  reset, // 核心方法：用于重置筛选
} = usePaginationList(getMyTeamList, {
  pageSize: 15,
  immediate: true, // 立即加载
  extraParams: {
    whetherUseCode: 1, // 固定参数
  },
  onSuccess: (res) => {
    // 请求成功后停止下拉刷新动画
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  onError: (err) => {
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
});

// 3. 监听总数变化
watch(total, (newVal) => {
  totalLength.value = newVal;
});

// 4. 搜索/筛选逻辑
const initData = reactive({
  search: '',
  identity: 'all',
});

// 监听筛选条件变化，调用 reset 重置分页并重新请求
const searchData = (data) => {
  const params = {};
  if (data.search) params.search = data.search;
  if (data.identity !== 'all') params.identity = data.identity;
  
  // reset 会将页码重置为 1，清空 list，并带上新的 params 请求
  reset(params);
};

// 5. 触底加载逻辑 (供父组件 onReachBottom 调用)
const onBottom = () => {
  // 检查是否已到末尾或正在加载，避免重复请求
  if (!pageEnd.value && !loading.value) {
    getList(); // 加载下一页
  }
};

// 暴露方法给父组件
defineExpose({
  searchData,
  onBottom,
});
</script>

```
## 完整代码

```javascript
import { ref } from 'vue'

export function usePaginationList(fetchFunction, options = {}) {
  const {
    pageSize = 15,          // 每页显示数量，默认为 15
    immediate = true,         // 是否在初始化时立即执行一次加载，默认为 true
    extraParams = {},         // 固定的额外请求参数，会与分页参数合并
    pageField = 'current',      // 后端接口分页参数：页码的字段名，默认为 'current'
    pageSizeField = 'limit',    // 后端接口分页参数：每页数量的字段名，默认为 'limit'
    onSuccess,                // 请求成功时的回调函数
    onError,                  // 请求失败时的回调函数
  } = options

  const list = ref([])        // 存储列表数据
  const currentPage = ref(1)  // 当前页码，默认为 1
  const loading = ref(false)    // 是否处于加载状态，默认为 false
  const pageEnd = ref(false)    // 是否已加载所有数据（没有更多了），默认为 false
  const noData = ref(false)     // 是否无数据（第一页就没有数据），默认为 false
  const total = ref(0)          // 数据总条目数
  const pages = ref(1)          // 总页数
  const params = ref({ ...extraParams }) // 当前请求的参数对象 (可变部分，包含 extraParams 和 reset 时传入的 newParams)
  const error = ref(null)       // 存储错误对象

  // 主要的数据加载函数
  const getList = async (isReset = false, customParams = {}) => {
    // console.log('getlit' , isReset , customParams) // 调试日志
    // 如果正在加载中，或者已经到达最后一页且非重置操作，则不执行后续逻辑
    if (loading.value || (pageEnd.value && !isReset)) return

    if (isReset) {
      // 如果是重置操作，恢复各状态到初始值
      currentPage.value = 1
      list.value = []
      pageEnd.value = false
      noData.value = false
      error.value = null
    }

    loading.value = true // 开始加载，设置 loading 为 true
    try {
      // 合并所有请求参数：
      // 1. params.value: 包含固定的 extraParams 和通过 reset 更新的参数
      // 2. customParams: 本次 getList 调用时临时传入的参数 (通常用于 reset)
      // 3. 分页参数: 当前页码和每页数量
      const mergedParams = {
        ...params.value,
        ...customParams,
        [pageField]: currentPage.value,
        [pageSizeField]: pageSize,
      }

      // 调用外部传入的实际数据请求函数
      const res = await fetchFunction(mergedParams);

      // ---- 处理响应数据 ----
      // 假设接口返回数据结构为: res = { list: [], total: 0, pages: 0 } 或 res.data = { list: [], total: 0, pages: 0 }
      // 请根据你的实际接口返回结构调整以下数据提取逻辑
      const dataList = res?.list || res?.data?.list || []; // 尝试从 res.list 或 res.data.list 获取列表数据
      pages.value = res?.pages || res?.data?.pages || 1;     // 尝试获取总页数
      total.value = res?.total || res?.data?.total || 0;     // 尝试获取总条目数
    

      if (currentPage.value === 1 && dataList.length === 0) {
        // 情况1: 第一页加载，且返回数据为空
        noData.value = true         
        pageEnd.value = true      
        list.value = []  
      } else {
        // 情况2: 非第一页加载，或者第一页有数据
        noData.value = false        // 设置为有数据状态
        // 如果是第一页，直接赋值；否则，在现有列表基础上追加数据
        list.value = currentPage.value === 1 ? dataList : list.value.concat(dataList)

        // 判断是否已到达最后一页
        if (currentPage.value >= pages.value || dataList.length < pageSize) {
          pageEnd.value = true  // 已到达最后一页
        } else {
          currentPage.value++   // 未到最后一页，页码增加，准备加载下一页
        }
      }
      onSuccess && onSuccess(res) 
    } catch (err) {
      error.value = err         // 保存错误信息
      onError && onError(err)   // 如果提供了 onError 回调，则执行它
      // 考虑在catch中也设置 noData 和 pageEnd，避免UI卡在奇怪的状态
      if (currentPage.value === 1) {
        noData.value = true;    // 如果是第一页出错，也标记为无数据
      }
      pageEnd.value = true;     // 出错时，通常也认为分页结束，避免无限重试
    } finally {
      loading.value = false     // 加载结束，设置 loading 为 false
    }
  }

  // 重置列表状态并重新加载数据
  // 通常用于筛选条件变化后调用
  const reset = (newParams = {}) => {
    params.value = { ...extraParams, ...newParams } // 将新的筛选参数与固定的 extraParams 合并更新到 params
    getList(true, newParams) // 调用 getList，并传入 isReset = true 以及新的参数作为 customParams
  }

  // 设置到指定页码并重新加载数据
  // 注意：此实现是重置并加载指定页，如果希望从指定页继续追加，getList逻辑需要调整
  const setPage = (page) => {
    if (page > 0 && page <= pages.value) { // 确保目标页码有效
      currentPage.value = page            // 设置当前页码为目标页码
      // getList(true) 会重置列表并从 currentPage.value 开始加载
      getList(true) 
    }
  }

  // 如果设置了 immediate 为 true, 则在 Hook 初始化时立即执行一次加载
  console.log('immediate', immediate);
  if (immediate) {
    getList() // 使用初始参数（extraParams）进行加载
  }

  return { // 返回供外部使用的属性和方法
    list,         // 列表数据 (ref)
    loading,      // 是否加载中 (ref)
    pageEnd,      // 是否已加载完毕 (ref)
    noData,       // 是否无数据 (ref)
    total,        // 总条目数 (ref)
    pages,        // 总页数 (ref)
    getList,      // 加载数据函数
    reset,        // 重置并加载函数
    setPage,      // 跳转到指定页并加载函数
    params,       // 当前请求参数 (ref)，外部可观察或修改（需谨慎）
    error,        // 错误对象 (ref)
    currentPage,  // 当前页码 (ref)
  }
}
```