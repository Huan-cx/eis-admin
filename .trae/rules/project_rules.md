# 项目规则描述文件

## 1. 概述

本文件定义了 Ruoyi-Vben 项目中开发规范和最佳实践。

## 2. 目录结构规范

### 2.1 语言包目录结构
### 2.2 目录命名规则

| 规则 | 说明 |
|-----|------|
| 语言目录 | 使用 ISO 639-1 语言代码 + ISO 3166-1 国家代码，如 zh-CN、en-US |
| 模块文件 | 使用小写字母 + 连字符，如 common.json |
| 禁止 | 中文或特殊字符命名 |

## 3. 文件命名规范

| 文件类型 | 命名规则 | 用途 |
|---------|---------|------|
| 通用词汇 | common.json | 全局通用文本（登录、退出、确认等） |
| UI 组件 | ui.json | 组件相关文本（提示、按钮、错误信息等） |
| 业务模块 | [module].json | 特定业务模块文本（认证、系统管理等） |

## 4. Key 命名规范

### 4.1 命名格式

三级结构：`模块名.分组名.键名`

```json
{
  "actionMessage": {
    "deleteSuccess": "{0} 删除成功",
    "deleteFailed": "{0} 删除失败"
  }
}
```

### 4.2 命名规则

| 规则 | 说明 | 示例 |
|-----|------|------|
| 模块名 | 对应 JSON 文件名 | ui、common |
| 分组名 | 功能分组 | actionMessage、formRules |
| 键名 | 具体翻译项 | deleteSuccess |
| 格式 | 小写字母 + 驼峰命名 | deleteSuccess |

## 5. 翻译函数使用规范

### 5.1 导入方式

```typescript
import { $t } from '#/locales';
```

### 5.2 基本调用

```typescript
const title = $t('common.login');
const message = $t('ui.actionMessage.deleteSuccess', ['用户']);
```

### 5.3 Vue 模板使用

```vue
<template>
  <div>{{ $t('common.confirm') }}</div>
</template>
```

### 5.4 检查翻译存在

```typescript
import { $te } from '#/locales';

if ($te('common.login')) {
  console.log('翻译存在');
}
```

## 6. 参数化规范

### 6.1 占位符格式

使用 `{数字}` 作为占位符，从 `{0}` 开始：

```json
{
  "deleting": "正在删除 {0} ..."
}
```

### 6.2 参数传递

```typescript
$t('ui.actionMessage.deleting', [row.name]);
```

### 6.3 规则说明

| 规则 | 说明 |
|-----|------|
| 占位符 | 必须从 `{0}` 开始顺序编号 |
| 参数 | 以数组形式传入 |
| 禁止 | 字符串拼接方式处理动态内容 |
| 参数国际化 | 如果参数是用户可见文本，必须先进行国际化 |

## 7. 初始化配置规范

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

## 8. 最佳实践

### 8.1 文本分离原则

错误：硬编码
```typescript
message.success('删除成功');
```

正确：使用 $t 函数
```typescript
message.success($t('ui.actionMessage.deleteSuccess', ['用户']));
```

### 8.2 参数国际化原则

错误：参数为硬编码文本
```typescript
message.success($t('ui.actionMessage.deleteSuccess', ['用户']));
```

正确：参数也需要国际化
```typescript
message.success($t('ui.actionMessage.deleteSuccess', [$t('common.user')]));
```

## 9. 扩展规范

### 9.1 添加新语言

1. 在 langs/ 下新建目录（如 ja-JP/）
2. 创建对应模块的 JSON 文件
3. 更新 typing.ts 中的 SupportedLanguagesType

### 9.2 添加新模块

1. 在对应语言目录下新建 JSON 文件
2. 遵循三级命名规范

## 10. 代码审查检查清单

- [ ] 所有用户可见文本是否使用 $t 函数
- [ ] Key 是否遵循 模块名.分组名.键名 规范
- [ ] 参数化是否使用 {0} 占位符
- [ ] 传入 $t() 的参数是否也进行了国际化
- [ ] 是否缺少必要的语言包
- [ ] 是否开启了缺失警告

## 11. 禁止事项

| 禁止行为 | 说明 |
|---------|------|
| 硬编码文本 | 所有用户可见文本必须使用 $t 函数 |
| 中文键名 | 键名必须使用英文 |
| 未定义占位符 | 禁止使用未定义的占位符 |
| 重复键名 | 禁止在同一模块中重复定义键名 |
| 直接导入 vxe-table | 必须从 #/adapter/vxe-table 导入 |
| cellRender props 函数 | 禁止在 cellRender.props 中使用函数 |

## 12. Vxe-Table 使用规范

### 12.1 导入规范

错误：直接从 vxe-table 导入
```typescript
import type { VxeTablePropTypes } from 'vxe-table'; // 错误
```

正确：从适配器导入
```typescript
import type { VxeTableGridOptions } from '#/adapter/vxe-table'; // 正确
```

### 12.2 列定义类型

```typescript
export function useGridColumns(): VxeTableGridOptions<DataType>['columns'] {
  return [
    { field: 'name', title: $t('common.name'), width: 120 },
  ];
}
```

### 12.3 单元格渲染规范

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

### 12.4 自定义渲染器使用

使用项目预定义的渲染器：
- CellDict - 字典渲染
- CellSwitch - 开关渲染
- CellOperation - 操作按钮渲染

```typescript
cellRender: { name: 'CellDict', props: { type: DICT_TYPE.COMMON_STATUS } },
```

## 13. 示例

### 13.1 语言文件示例

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

### 13.2 使用示例

```typescript
import { $t } from '#/locales';

message.success($t('ui.actionMessage.deleteSuccess', [$t('common.menu')]));

message.loading({
  content: $t('ui.actionMessage.deleting', [row.name]),
  duration: 0,
});
```

---

版本: 1.1
创建日期: 2026-05-15
适用项目: Ruoyi-Vben
更新说明: 添加了 Vxe-Table 使用规范