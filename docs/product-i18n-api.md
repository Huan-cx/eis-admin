# 商品国际化翻译接口文档

## 概述

本文档描述了商品模块的国际化翻译相关接口，包括多语言翻译的增删改查操作。

---

## 目录

1. [语言管理接口](#1-语言管理接口)
2. [SPU翻译接口](#2-spu翻译接口)
3. [品牌翻译接口](#3-品牌翻译接口)
4. [分类翻译接口](#4-分类翻译接口)
5. [规格翻译接口](#5-规格翻译接口)
6. [规格值翻译接口](#6-规格值翻译接口)
7. [翻译任务接口](#7-翻译任务接口)

---

## 1. 语言管理接口

### 1.1 获取语言列表

- **接口路径**: `GET /product/language/list`
- **功能描述**: 获取所有启用状态的语言列表
- **请求参数**: 无
- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "code": "zh-CN",
      "name": "中文",
      "nativeName": "中文",
      "flag": "🇨🇳",
      "isDefault": true,
      "status": 1,
      "sort": 1,
      "createTime": "2024-01-01T00:00:00"
    },
    {
      "id": 2,
      "code": "en-US",
      "name": "English",
      "nativeName": "English",
      "flag": "🇺🇸",
      "isDefault": false,
      "status": 1,
      "sort": 2,
      "createTime": "2024-01-01T00:00:00"
    }
  ]
}
```

### 1.2 获取语言详情

- **接口路径**: `GET /product/language/get?id={id}`
- **功能描述**: 获取单个语言的详细信息
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| id | Long | 是 | 语言ID |

### 1.3 创建语言

- **接口路径**: `POST /product/language/create`
- **功能描述**: 创建新的语言配置
- **请求体**:

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| code | String | 是 | 语言编码（如 zh-CN, en-US） |
| name | String | 是 | 语言名称 |
| nativeName | String | 否 | 本地名称 |
| flag | String | 否 | 国旗emoji |
| isDefault | Boolean | 否 | 是否默认语言 |
| status | Integer | 是 | 状态（0-禁用，1-启用） |
| sort | Integer | 否 | 排序号 |

### 1.4 更新语言

- **接口路径**: `PUT /product/language/update`
- **功能描述**: 更新语言配置
- **请求体**: 同创建接口，必须包含 `id` 字段

### 1.5 删除语言

- **接口路径**: `DELETE /product/language/delete?id={id}`
- **功能描述**: 删除指定语言
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| id | Long | 是 | 语言ID |

### 1.6 设置默认语言

- **接口路径**: `PUT /product/language/update-default?id={id}`
- **功能描述**: 设置指定语言为默认语言
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| id | Long | 是 | 语言ID |

---

## 2. SPU翻译接口

### 2.1 获取SPU翻译列表

- **接口路径**: `GET /product/i18n/spu/{spuId}`
- **功能描述**: 获取指定SPU的所有语言翻译
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| spuId | Long | 是 | SPU编号 |

- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "spuId": 1001,
      "languageCode": "en-US",
      "name": "Product Name",
      "keyword": "keyword1, keyword2",
      "introduction": "Product introduction",
      "description": "<p>Product description</p>",
      "createTime": "2024-01-01T00:00:00",
      "updateTime": "2024-01-01T00:00:00"
    }
  ]
}
```

### 2.2 保存SPU翻译

- **接口路径**: `POST /product/i18n/spu/{spuId}`
- **功能描述**: 保存SPU的多语言翻译（会先删除旧数据再插入新数据）
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| spuId | Long | 是 | SPU编号 |

- **请求体**:

```json
[
  {
    "languageCode": "en-US",
    "name": "Product Name",
    "keyword": "keyword1, keyword2",
    "introduction": "Product introduction",
    "description": "<p>Product description</p>"
  },
  {
    "languageCode": "ja-JP",
    "name": "商品名",
    "keyword": "キーワード",
    "introduction": "商品紹介",
    "description": "<p>商品説明</p>"
  }
]
```

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| languageCode | String | 是 | 语言编码 |
| name | String | 否 | 商品名称翻译 |
| keyword | String | 否 | 关键词翻译 |
| introduction | String | 否 | 简介翻译 |
| description | String | 否 | 详情描述翻译（富文本） |

### 2.3 删除SPU翻译

- **接口路径**: `DELETE /product/i18n/spu/{spuId}?languageCode={languageCode}`
- **功能描述**: 删除指定SPU的指定语言翻译
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| spuId | Long | 是 | SPU编号 |

- **查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| languageCode | String | 是 | 语言编码 |

---

## 3. 品牌翻译接口

### 3.1 获取品牌翻译列表

- **接口路径**: `GET /product/i18n/brand/{brandId}`
- **功能描述**: 获取指定品牌的所有语言翻译
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| brandId | Long | 是 | 品牌编号 |

- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "brandId": 101,
      "languageCode": "en-US",
      "name": "Brand Name",
      "description": "<p>Brand description</p>",
      "createTime": "2024-01-01T00:00:00",
      "updateTime": "2024-01-01T00:00:00"
    }
  ]
}
```

### 3.2 保存品牌翻译

- **接口路径**: `POST /product/i18n/brand/{brandId}`
- **功能描述**: 保存品牌的多语言翻译
- **请求体**:

```json
[
  {
    "languageCode": "en-US",
    "name": "Brand Name",
    "description": "<p>Brand description</p>"
  }
]
```

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| languageCode | String | 是 | 语言编码 |
| name | String | 否 | 品牌名称翻译 |
| description | String | 否 | 品牌描述翻译（富文本） |

### 3.3 删除品牌翻译

- **接口路径**: `DELETE /product/i18n/brand/{brandId}?languageCode={languageCode}`
- **功能描述**: 删除指定品牌的指定语言翻译

---

## 4. 分类翻译接口

### 4.1 获取分类翻译列表

- **接口路径**: `GET /product/i18n/category/{categoryId}`
- **功能描述**: 获取指定分类的所有语言翻译

### 4.2 保存分类翻译

- **接口路径**: `POST /product/i18n/category/{categoryId}`
- **功能描述**: 保存分类的多语言翻译
- **请求体**:

```json
[
  {
    "languageCode": "en-US",
    "name": "Category Name"
  }
]
```

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| languageCode | String | 是 | 语言编码 |
| name | String | 否 | 分类名称翻译 |

### 4.3 删除分类翻译

- **接口路径**: `DELETE /product/i18n/category/{categoryId}?languageCode={languageCode}`
- **功能描述**: 删除指定分类的指定语言翻译

---

## 5. 规格翻译接口

### 5.1 获取规格翻译列表

- **接口路径**: `GET /product/i18n/property/{propertyId}`
- **功能描述**: 获取指定规格的所有语言翻译

### 5.2 保存规格翻译

- **接口路径**: `POST /product/i18n/property/{propertyId}`
- **功能描述**: 保存规格的多语言翻译
- **请求体**:

```json
[
  {
    "languageCode": "en-US",
    "name": "Property Name"
  }
]
```

### 5.3 删除规格翻译

- **接口路径**: `DELETE /product/i18n/property/{propertyId}?languageCode={languageCode}`
- **功能描述**: 删除指定规格的指定语言翻译

---

## 6. 规格值翻译接口

### 6.1 获取规格值翻译列表

- **接口路径**: `GET /product/i18n/property-value/{propertyValueId}`
- **功能描述**: 获取指定规格值的所有语言翻译

### 6.2 保存规格值翻译

- **接口路径**: `POST /product/i18n/property-value/{propertyValueId}`
- **功能描述**: 保存规格值的多语言翻译
- **请求体**:

```json
[
  {
    "languageCode": "en-US",
    "name": "Value Name"
  }
]
```

### 6.3 删除规格值翻译

- **接口路径**: `DELETE /product/i18n/property-value/{propertyValueId}?languageCode={languageCode}`
- **功能描述**: 删除指定规格值的指定语言翻译

---

## 7. 翻译任务接口

### 7.1 执行单次翻译

- **接口路径**: `POST /product/translate/execute`
- **功能描述**: 执行单次文本翻译
- **请求体**:

```json
{
  "provider": "baidu",
  "textList": ["Hello", "World"],
  "targetLanguage": "zh-CN"
}
```

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| provider | String | 否 | 翻译供应商（默认使用配置的默认供应商） |
| textList | String[] | 是 | 待翻译的文本列表 |
| targetLanguage | String | 是 | 目标语言编码 |

- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "results": ["你好", "世界"],
    "provider": "baidu",
    "targetLanguage": "zh-CN"
  }
}
```

### 7.2 创建SPU批量翻译任务

- **接口路径**: `POST /product/translate/batch/spu`
- **功能描述**: 创建SPU批量翻译任务
- **请求体**:

```json
{
  "provider": "baidu",
  "targetIds": [1001, 1002, 1003],
  "targetLanguage": "en-US"
}
```

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| provider | String | 否 | 翻译供应商 |
| targetIds | Long[] | 是 | 待翻译的SPU ID列表 |
| targetLanguage | String | 是 | 目标语言编码 |

- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "taskId": 1,
    "message": "批量翻译任务已提交，系统正在后台处理，请稍后刷新列表查看。"
  }
}
```

### 7.3 创建品牌批量翻译任务

- **接口路径**: `POST /product/translate/batch/brand`
- **功能描述**: 创建品牌批量翻译任务
- **请求体**: 同SPU批量翻译接口

### 7.4 创建分类批量翻译任务

- **接口路径**: `POST /product/translate/batch/category`
- **功能描述**: 创建分类批量翻译任务
- **请求体**: 同SPU批量翻译接口

### 7.5 获取翻译任务状态

- **接口路径**: `GET /product/translate/task/{taskId}`
- **功能描述**: 获取指定翻译任务的状态
- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": 1,
    "type": "spu",
    "targetLanguage": "en-US",
    "provider": "baidu",
    "totalCount": 10,
    "successCount": 8,
    "failCount": 2,
    "status": 2,
    "statusText": "已完成",
    "createTime": "2024-01-01T00:00:00",
    "updateTime": "2024-01-01T00:05:00"
  }
}
```

| 状态码 | 状态文本 | 说明 |
| :--- | :--- | :--- |
| 0 | 待处理 | 任务已创建，等待处理 |
| 1 | 处理中 | 任务正在执行 |
| 2 | 已完成 | 任务执行完成 |
| 3 | 失败 | 任务执行失败 |

### 7.6 获取最近翻译任务列表

- **接口路径**: `GET /product/translate/task/list?limit=10`
- **功能描述**: 获取最近的翻译任务列表
- **查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| limit | Integer | 否 | 返回数量限制，默认10 |

### 7.7 获取可用翻译供应商

- **接口路径**: `GET /product/translate/providers`
- **功能描述**: 获取当前系统可用的翻译供应商列表
- **响应示例**:

```json
{
  "code": 0,
  "message": "成功",
  "data": ["baidu", "google", "tencent"]
}
```

---

## 数据模型

### Language（语言）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| code | String | 语言编码 |
| name | String | 语言名称 |
| nativeName | String | 本地名称 |
| flag | String | 国旗emoji |
| isDefault | Boolean | 是否默认语言 |
| status | Integer | 状态（0-禁用，1-启用） |
| sort | Integer | 排序号 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### I18nProductSpu（SPU翻译）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| spuId | Long | SPU编号 |
| languageCode | String | 语言编码 |
| name | String | 名称翻译 |
| keyword | String | 关键词翻译 |
| introduction | String | 简介翻译 |
| description | String | 详情描述翻译 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### I18nProductBrand（品牌翻译）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| brandId | Long | 品牌编号 |
| languageCode | String | 语言编码 |
| name | String | 名称翻译 |
| description | String | 描述翻译 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### I18nProductCategory（分类翻译）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| categoryId | Long | 分类编号 |
| languageCode | String | 语言编码 |
| name | String | 名称翻译 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### I18nProductProperty（规格翻译）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| propertyId | Long | 规格编号 |
| languageCode | String | 语言编码 |
| name | String | 名称翻译 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### I18nProductPropertyValue（规格值翻译）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| propertyValueId | Long | 规格值编号 |
| languageCode | String | 语言编码 |
| name | String | 名称翻译 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

### TranslateTask（翻译任务）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | Long | 主键ID |
| type | String | 任务类型（spu/brand/category） |
| targetLanguage | String | 目标语言 |
| provider | String | 翻译供应商 |
| totalCount | Integer | 总数量 |
| successCount | Integer | 成功数量 |
| failCount | Integer | 失败数量 |
| status | Integer | 状态 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |

---

## 错误码

| 错误码 | 说明 |
| :--- | :--- |
| 500 | 翻译供应商未启用 |
| 其他 | 业务异常，具体信息在message字段中 |