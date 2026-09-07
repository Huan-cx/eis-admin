# 项目规则描述文件

## 1. 概述

本文件定义了 yudao-ui-admin-vben 项目（基于 Ruoyi-Vben）的开发规范和最佳实践。

### 基本信息

- **项目名称**: yudao-ui-admin-vben (Vben Admin Monorepo v5.5.9)
- **项目路径**: `d:\Workspace\Ruoyi\EIS\yudao-ui-admin-vben`
- **技术栈**: Vue 3 + TypeScript + Ant Design Vue + Vben Admin
- **构建工具**: Vite + Turbo (Monorepo)
- **包管理**: pnpm (>=10.0.0) + pnpm workspace
- **Node 版本**: >=20.19.0
- **用途**: B2B 后台管理系统，供管理员进行商品管理、订单管理、促销活动配置等操作

### 核心目录结构

```
yudao-ui-admin-vben/          # Monorepo 根目录
├── apps/
│   └── web-antd/             # Ant Design Vue 应用
│       └── src/
│           ├── adapter/      # 适配器（vxe-table、form 等）
│           ├── api/          # API 接口定义
│           │   └── mall/     # Mall 模块 API
│           ├── assets/       # 静态资源
│           ├── components/   # 公共组件
│           ├── layouts/      # 布局组件
│           ├── locales/      # 国际化文件
│           ├── plugins/      # 插件
│           ├── router/       # 路由配置
│           ├── store/        # Pinia 状态管理
│           ├── types/        # TypeScript 类型定义
│           ├── utils/        # 工具函数
│           └── views/        # 页面视图
│               └── mall/     # Mall 模块页面
├── packages/                 # 共享包
├── pnpm-workspace.yaml       # Monorepo 工作区配置
└── turbo.json                # Turbo 构建配置
```

### Mall 模块目录

`views/mall/` 下包含：home、language、product、promotion、statistics、trade
`api/mall/` 下包含：product、promotion、statistics、trade

---

## 2. 目录结构规范

### 2.1 标准模块结构

每个功能模块遵循统一的目录结构：

```
module/
├── index.vue          # 主页面（列表页）
├── data.ts            # 数据配置（表单schema、表格列）
├── modules/           # 子组件目录
│   └── form.vue       # 表单弹窗组件
├── components/        # 公共组件目录（可选，复杂模块）
│   └── index.ts       # 组件导出
│   └── *.vue          # 公共组件文件
└── form/              # 复杂表单目录（可选，如SPU）
    ├── index.vue      # 表单主页面
    ├── data.ts        # 表单数据配置
    └── modules/       # 表单子组件
```

### 2.2 实际示例

**品牌模块（简单模块）**：
```
product/brand/
├── index.vue          # 品牌列表页
├── data.ts            # 表格列、搜索表单、编辑表单配置
└── modules/
    └── form.vue       # 品牌编辑表单弹窗
```

**商品SPU模块（复杂模块）**：
```
product/spu/
├── index.vue          # 商品列表页
├── data.ts            # 列表页数据配置
├── form/              # 商品编辑表单（独立页面）
│   ├── index.vue      # 表单主页面
│   ├── data.ts        # 表单数据配置
│   └── modules/       # 表单子组件
├── components/        # 公共组件
│   ├── index.ts       # 组件导出
│   ├── spu-select.vue
│   ├── sku-list.vue
│   └── type.ts        # 类型定义
```

### 2.3 语言包目录结构

| 规则 | 说明 |
|-----|------|
| 语言目录 | 使用 ISO 639-1 语言代码 + ISO 3166-1 国家代码，如 zh-CN、en-US |
| 模块文件 | 使用小写字母 + 连字符，如 common.json |
| 禁止 | 中文或特殊字符命名 |

### 2.4 文件命名规范

| 文件类型 | 命名规则 | 用途 |
|---------|---------|------|
| 通用词汇 | common.json | 全局通用文本（登录、退出、确认等） |
| UI 组件 | ui.json | 组件相关文本（提示、按钮、错误信息等） |
| 业务模块 | [module].json | 特定业务模块文本（认证、系统管理等） |

---

## 3. 页面组件设计模式

### 3.1 列表页（index.vue）标准模板

```vue
<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallXxxApi } from '#/api/mall/xxx';

import { Page, useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteXxx, getXxxPage } from '#/api/mall/xxx';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

// 1. 表单弹窗
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 2. 刷新表格
function handleRefresh() {
  gridApi.query();
}

// 3. 创建操作
function handleCreate() {
  formModalApi.setData(null).open();
}

// 4. 编辑操作
function handleEdit(row: MallXxxApi.Xxx) {
  formModalApi.setData(row).open();
}

// 5. 删除操作
async function handleDelete(row: MallXxxApi.Xxx) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteXxx(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

// 6. 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getXxxPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MallXxxApi.Xxx>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            { icon: ACTION_ICON.EDIT, tooltip: $t('common.edit'), onClick: handleEdit.bind(null, row) },
            { icon: ACTION_ICON.DELETE, tooltip: $t('common.delete'), onClick: handleDelete.bind(null, row) },
          ]"
        />
      </template>
    </Grid>
    <FormModal @success="handleRefresh" />
  </Page>
</template>
```

### 3.2 表单弹窗（modules/form.vue）标准模板

```vue
<script lang="ts" setup>
import type { MallXxxApi } from '#/api/mall/xxx';

import { computed, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createXxx, getXxx, updateXxx } from '#/api/mall/xxx';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MallXxxApi.Xxx>();

// 1. 标题计算
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('mall-xxx.title')])
    : $t('ui.actionTitle.create', [$t('mall-xxx.title')]);
});

// 2. 表单配置（注意：showDefaultActions: false）
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  schema: useFormSchema(),
  showDefaultActions: false,  // 重要：避免重复按钮
});

// 3. Modal配置
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await (formData.value?.id
        ? updateXxx(data as MallXxxApi.Xxx)
        : createXxx(data as MallXxxApi.Xxx));
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载编辑数据
    const data = modalApi.getData<MallXxxApi.Xxx>();
    if (data?.id) {
      formData.value = await getXxx(data.id);
      await formApi.setValues(formData.value);
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form />
  </Modal>
</template>
```

---

## 4. 数据配置（data.ts）规范

### 4.1 配置函数命名规范

| 函数名 | 用途 | 返回类型 |
|--------|------|----------|
| `useGridFormSchema()` | 列表页搜索表单 | `VbenFormSchema[]` |
| `useGridColumns()` | 列表页表格列 | `VxeTableGridOptions['columns']` |
| `useFormSchema()` | 新增/修改表单 | `VbenFormSchema[]` |

### 4.2 搜索表单配置示例

```typescript
/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('mall-xxx.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-xxx.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('mall-xxx.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('mall-xxx.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('common.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}
```

### 4.3 表格列配置示例

```typescript
/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('mall-xxx.id'),
      fixed: 'left',
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('mall-xxx.name'),
      minWidth: 200,
    },
    {
      field: 'picUrl',
      title: $t('mall-xxx.picUrl'),
      minWidth: 100,
      cellRender: { name: 'CellImage' },
    },
    {
      field: 'status',
      title: $t('mall-xxx.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellTag',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('mall-xxx.createTime'),
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
```

### 4.4 编辑表单配置示例

```typescript
/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,  // 隐藏ID字段
      },
    },
    {
      fieldName: 'name',
      label: $t('mall-xxx.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-xxx.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('mall-xxx.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        maxSize: 30,
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: $t('mall-xxx.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('mall-xxx.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('mall-xxx.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
  ];
}
```

---

## 5. API 设计规范

### 5.1 类型定义规范

使用 namespace 定义接口类型：

```typescript
export namespace MallXxxApi {
  /** 实体名称 */
  export interface Xxx {
    id?: number;           // 编号（可选，创建时不需要）
    name: string;          // 名称（必填）
    picUrl?: string;       // 图片URL（可选）
    sort?: number;         // 排序（可选）
    status: number;        // 状态（必填）
    description?: string;  // 描述（可选）
    createTime?: string;   // 创建时间（可选，后端返回）
  }
}
```

### 5.2 API 函数命名规范

| 操作 | 函数名 | HTTP方法 |
|------|--------|----------|
| 创建 | `createXxx(data)` | POST |
| 更新 | `updateXxx(data)` | PUT |
| 删除 | `deleteXxx(id)` | DELETE |
| 获取单个 | `getXxx(id)` | GET |
| 获取分页 | `getXxxPage(params)` | GET |
| 获取精简列表 | `getSimpleXxxList()` | GET |

### 5.3 API 函数实现示例

```typescript
import type { PageParam, PageResult } from '@vben/request';
import { requestClient } from '#/api/request';

export namespace MallXxxApi {
  export interface Xxx { ... }
}

/** 创建 */
export function createXxx(data: MallXxxApi.Xxx) {
  return requestClient.post('/xxx/create', data);
}

/** 更新 */
export function updateXxx(data: MallXxxApi.Xxx) {
  return requestClient.put('/xxx/update', data);
}

/** 删除 */
export function deleteXxx(id: number) {
  return requestClient.delete(`/xxx/delete?id=${id}`);
}

/** 获取单个 */
export function getXxx(id: number) {
  return requestClient.get<MallXxxApi.Xxx>(`/xxx/get?id=${id}`);
}

/** 获取分页 */
export function getXxxPage(params: PageParam) {
  return requestClient.get<PageResult<MallXxxApi.Xxx>>('/xxx/page', { params });
}

/** 获取精简列表 */
export function getSimpleXxxList() {
  return requestClient.get<MallXxxApi.Xxx[]>('/xxx/list-all-simple');
}
```

---

## 6. 国际化规范

### 6.1 国际化文件位置

```
locales/
├── zh-CN/
│   └── mall-product.json   # 中文翻译
├── en-US/
│   └── mall-product.json   # 英文翻译
```

### 6.2 翻译 Key 命名规范

```json
{
  "mall-product": {
    "brand": {
      "title": "品牌",
      "name": "品牌名称",
      "picUrl": "品牌图片",
      "sort": "排序",
      "status": "状态",
      "description": "描述",
      "placeholder": {
        "name": "请输入品牌名称",
        "picUrl": "请上传品牌图片",
        "sort": "请输入排序",
        "description": "请输入描述"
      }
    }
  }
}
```

### 6.3 Key 命名格式

三级结构：`模块名.分组名.键名`

| 规则 | 说明 | 示例 |
|-----|------|------|
| 模块名 | 对应 JSON 文件名 | ui、common |
| 分组名 | 功能分组 | actionMessage、formRules |
| 键名 | 具体翻译项 | deleteSuccess |
| 格式 | 小写字母 + 驼峰命名 | deleteSuccess |

### 6.4 翻译函数使用规范

#### 导入方式

```typescript
import { $t } from '#/locales';
```

#### 基本调用

```typescript
const title = $t('common.login');
const message = $t('ui.actionMessage.deleteSuccess', ['用户']);
```

#### Vue 模板使用

```vue
<template>
  <div>{{ $t('common.confirm') }}</div>
</template>
```

#### 检查翻译存在

```typescript
import { $te } from '#/locales';

if ($te('common.login')) {
  console.log('翻译存在');
}
```

#### 组合使用（带参数）

```typescript
// 在代码中使用
$t('mall-product.brand.name')
$t('mall-product.brand.placeholder.name')

// 组合使用（带参数）
$t('ui.actionTitle.edit', [$t('mall-product.brand.title')])
$t('ui.actionMessage.deleteSuccess', [row.name])
```

### 6.5 参数化规范

使用 `{数字}` 作为占位符，从 `{0}` 开始：

```json
{
  "deleting": "正在删除 {0} ..."
}
```

```typescript
$t('ui.actionMessage.deleting', [row.name]);
```

| 规则 | 说明 |
|-----|------|
| 占位符 | 必须从 `{0}` 开始顺序编号 |
| 参数 | 以数组形式传入 |
| 禁止 | 字符串拼接方式处理动态内容 |
| 参数国际化 | 如果参数是用户可见文本，必须先进行国际化 |

### 6.6 初始化配置规范

```typescript
import { setupI18n } from '#/locales';

await setupI18n(app, {
  defaultLocale: 'zh-CN',
  missingWarn: true,
  loadMessages: async (lang) => {
    return {};
  }
});
```

---

## 7. Vxe-Table 使用规范

### 7.1 导入规范

错误：直接从 vxe-table 导入
```typescript
import type { VxeTablePropTypes } from 'vxe-table'; // 错误
```

正确：从适配器导入
```typescript
import type { VxeTableGridOptions } from '#/adapter/vxe-table'; // 正确
```

### 7.2 列定义类型

```typescript
export function useGridColumns(): VxeTableGridOptions<DataType>['columns'] {
  return [
    { field: 'name', title: $t('common.name'), width: 120 },
  ];
}
```

### 7.3 单元格渲染规范

错误：在 props 中使用函数
```typescript
cellRender: {
  name: 'status',
  props: {
    status: ({ row }) => row.isDefault ? 'success' : 'default', // 错误
  },
},
```

正确：使用 formatter
```typescript
formatter: ({ cellValue }) => {
  return cellValue ? $t('common.yes') : $t('common.no'); // 正确
},
```

### 7.4 自定义渲染器使用

使用项目预定义的渲染器：
- CellDict - 字典渲染
- CellSwitch - 开关渲染
- CellOperation - 操作按钮渲染

```typescript
cellRender: { name: 'CellDict', props: { type: DICT_TYPE.COMMON_STATUS } },
```

---

## 8. 常见问题解决方案

### 8.1 表单重复按钮问题

**问题**：Modal 和 Form 都显示提交按钮

**解决**：在 `useVbenForm` 配置中添加 `showDefaultActions: false`

```typescript
const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,  // 关闭表单默认按钮
});
```

### 8.2 表格图片显示

使用 `CellImage` 渲染器：

```typescript
{
  field: 'picUrl',
  title: '图片',
  cellRender: { name: 'CellImage' },
}
```

### 8.3 表格状态显示

使用 `CellTag` 渲染器配合字典类型：

```typescript
{
  field: 'status',
  title: '状态',
  cellRender: {
    name: 'CellTag',
    props: { type: DICT_TYPE.COMMON_STATUS },
  },
}
```

### 8.4 表格状态切换

使用 `CellSwitch` 渲染器：

```typescript
{
  field: 'status',
  title: '状态',
  cellRender: {
    name: 'CellSwitch',
    attrs: { beforeChange: onStatusChange },
    props: {
      checkedValue: 1,
      checkedChildren: '启用',
      unCheckedValue: 0,
      unCheckedChildren: '禁用',
    },
  },
}
```

---

## 9. 模块分类

**简单模块（标准CRUD）**：
- product/brand（品牌）
- product/category（分类）
- product/supplier（供应商）
- promotion/banner（Banner）
- promotion/article/category（文章分类）

**复杂模块（需要额外组件）**：
- product/spu（商品SPU）
- product/property（商品属性）
- trade/order（订单）
- promotion/coupon（优惠券）

**详情模块（只显示详情）**：
- trade/order/detail（订单详情）
- trade/afterSale/detail（售后详情）

---

## 10. 最佳实践

### 10.1 文本分离原则

错误：硬编码
```typescript
message.success('删除成功');
```

正确：使用 $t 函数
```typescript
message.success($t('ui.actionMessage.deleteSuccess', ['用户']));
```

### 10.2 参数国际化原则

错误：参数为硬编码文本
```typescript
message.success($t('ui.actionMessage.deleteSuccess', ['用户']));
```

正确：参数也需要国际化
```typescript
message.success($t('ui.actionMessage.deleteSuccess', [$t('common.user')]));
```

---

## 11. 扩展规范

### 11.1 添加新语言

1. 在 langs/ 下新建目录（如 ja-JP/）
2. 创建对应模块的 JSON 文件
3. 更新 typing.ts 中的 SupportedLanguagesType

### 11.2 添加新模块

1. 在对应语言目录下新建 JSON 文件
2. 遵循三级命名规范

---

## 12. 代码审查检查清单

- [ ] 所有用户可见文本是否使用 $t 函数
- [ ] Key 是否遵循 模块名.分组名.键名 规范
- [ ] 参数化是否使用 {0} 占位符
- [ ] 传入 $t() 的参数是否也进行了国际化
- [ ] 是否缺少必要的语言包
- [ ] 是否开启了缺失警告
- [ ] vxe-table 是否从 #/adapter/vxe-table 导入
- [ ] cellRender.props 中是否使用了函数

---

## 13. 禁止事项

| 禁止行为 | 说明 |
|---------|------|
| 硬编码文本 | 所有用户可见文本必须使用 $t 函数 |
| 中文键名 | 键名必须使用英文 |
| 未定义占位符 | 禁止使用未定义的占位符 |
| 重复键名 | 禁止在同一模块中重复定义键名 |
| 直接导入 vxe-table | 必须从 #/adapter/vxe-table 导入 |
| cellRender props 函数 | 禁止在 cellRender.props 中使用函数 |

---

## 14. 示例

### 14.1 语言文件示例

**zh-CN/ui.json**：
```json
{
  "actionMessage": {
    "deleteSuccess": "{0} 删除成功",
    "updateSuccess": "更新 {0} 成功"
  }
}
```

**en-US/ui.json**：
```json
{
  "actionMessage": {
    "deleteSuccess": "{0} deleted successfully",
    "updateSuccess": "{0} updated successfully"
  }
}
```

### 14.2 使用示例

```typescript
import { $t } from '#/locales';

message.success($t('ui.actionMessage.deleteSuccess', [$t('common.menu')]));

message.loading({
  content: $t('ui.actionMessage.deleting', [row.name]),
  duration: 0,
});
```

---

版本: 2.0
创建日期: 2026-05-15
更新日期: 2026-08-16
适用项目: yudao-ui-admin-vben (Vben Admin Monorepo v5.5.9)
更新说明: 合并 Mall 模块 Vue 开发规范（目录结构、页面组件设计模式、data.ts 规范、API 设计规范、常见问题解决方案、模块分类），更新项目位置说明
