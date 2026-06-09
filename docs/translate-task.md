# 芋道快速开发平台


**简介**:芋道快速开发平台


**HOST**:http://127.0.0.1:48080


**联系人**:


**Version**:1.0.0


**接口路径**:/v3/api-docs/translate-task


[TOC]






# 管理后台 - 翻译任务


## 同步执行翻译任务(小批量测试用)


**接口地址**:`/admin-api/translate-task/execute-sync`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "translateType": "PRODUCT",
  "targetLanguages": [],
  "provider": "alibaba",
  "overwrite": false,
  "batchSize": 100,
  "async": true
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|translateTaskCreateReqVO|管理后台 - 翻译任务创建请求 VO|body|true|TranslateTaskCreateReqVO|TranslateTaskCreateReqVO|
|&emsp;&emsp;translateType|翻译类型: ALL-全部, PRODUCT-商品, CATEGORY-分类, BRAND-品牌, ARTICLE-文章, PROPERTY-属性||true|string||
|&emsp;&emsp;targetLanguages|目标语言列表||true|array|string|
|&emsp;&emsp;provider|翻译供应商: google, alibaba, tencent||true|string||
|&emsp;&emsp;overwrite|是否覆盖旧翻译(删除后重新翻译)||false|boolean||
|&emsp;&emsp;batchSize|批量大小(每批处理数量)||false|integer(int32)||
|&emsp;&emsp;async|是否异步执行||false|boolean||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultTranslateTaskRespVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||TranslateTaskRespVO|TranslateTaskRespVO|
|&emsp;&emsp;taskId|任务ID|integer(int64)||
|&emsp;&emsp;translateType|翻译类型|string||
|&emsp;&emsp;targetLanguage|目标语言|string||
|&emsp;&emsp;status|状态: PENDING-待执行, RUNNING-执行中, COMPLETED-已完成, FAILED-失败|string||
|&emsp;&emsp;totalCount|总数|integer(int32)||
|&emsp;&emsp;translatedCount|已翻译数|integer(int32)||
|&emsp;&emsp;skippedCount|跳过数(已有翻译)|integer(int32)||
|&emsp;&emsp;failedCount|失败数|integer(int32)||
|&emsp;&emsp;startTime|开始时间|string(date-time)||
|&emsp;&emsp;endTime|结束时间|string(date-time)||
|&emsp;&emsp;errorMessage|错误信息|string||
|&emsp;&emsp;progress|进度(0-100)|integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"taskId": 1,
		"translateType": "PRODUCT",
		"targetLanguage": "en",
		"status": "RUNNING",
		"totalCount": 1000,
		"translatedCount": 500,
		"skippedCount": 100,
		"failedCount": 10,
		"startTime": "",
		"endTime": "",
		"errorMessage": "",
		"progress": 50
	}
}
```


## 创建翻译任务


**接口地址**:`/admin-api/translate-task/create`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "translateType": "PRODUCT",
  "targetLanguages": [],
  "provider": "alibaba",
  "overwrite": false,
  "batchSize": 100,
  "async": true
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|translateTaskCreateReqVO|管理后台 - 翻译任务创建请求 VO|body|true|TranslateTaskCreateReqVO|TranslateTaskCreateReqVO|
|&emsp;&emsp;translateType|翻译类型: ALL-全部, PRODUCT-商品, CATEGORY-分类, BRAND-品牌, ARTICLE-文章, PROPERTY-属性||true|string||
|&emsp;&emsp;targetLanguages|目标语言列表||true|array|string|
|&emsp;&emsp;provider|翻译供应商: google, alibaba, tencent||true|string||
|&emsp;&emsp;overwrite|是否覆盖旧翻译(删除后重新翻译)||false|boolean||
|&emsp;&emsp;batchSize|批量大小(每批处理数量)||false|integer(int32)||
|&emsp;&emsp;async|是否异步执行||false|boolean||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int64)|integer(int64)|


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0
}
```


## 取消任务


**接口地址**:`/admin-api/translate-task/cancel`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|taskId|任务ID|query|true|integer(int64)||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 获取支持的翻译类型


**接口地址**:`/admin-api/translate-task/types`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultListTranslateTypeOption|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|TranslateTypeOption|
|&emsp;&emsp;value||string||
|&emsp;&emsp;label||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"value": "",
			"label": ""
		}
	]
}
```


## 获取任务状态


**接口地址**:`/admin-api/translate-task/status`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|taskId|任务ID|query|true|integer(int64)||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultTranslateTaskRespVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||TranslateTaskRespVO|TranslateTaskRespVO|
|&emsp;&emsp;taskId|任务ID|integer(int64)||
|&emsp;&emsp;translateType|翻译类型|string||
|&emsp;&emsp;targetLanguage|目标语言|string||
|&emsp;&emsp;status|状态: PENDING-待执行, RUNNING-执行中, COMPLETED-已完成, FAILED-失败|string||
|&emsp;&emsp;totalCount|总数|integer(int32)||
|&emsp;&emsp;translatedCount|已翻译数|integer(int32)||
|&emsp;&emsp;skippedCount|跳过数(已有翻译)|integer(int32)||
|&emsp;&emsp;failedCount|失败数|integer(int32)||
|&emsp;&emsp;startTime|开始时间|string(date-time)||
|&emsp;&emsp;endTime|结束时间|string(date-time)||
|&emsp;&emsp;errorMessage|错误信息|string||
|&emsp;&emsp;progress|进度(0-100)|integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"taskId": 1,
		"translateType": "PRODUCT",
		"targetLanguage": "en",
		"status": "RUNNING",
		"totalCount": 1000,
		"translatedCount": 500,
		"skippedCount": 100,
		"failedCount": 10,
		"startTime": "",
		"endTime": "",
		"errorMessage": "",
		"progress": 50
	}
}
```


## 获取可用翻译供应商


**接口地址**:`/admin-api/translate-task/providers`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultListString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": []
}
```


## 获取任务列表


**接口地址**:`/admin-api/translate-task/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultListTranslateTaskRespVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|TranslateTaskRespVO|
|&emsp;&emsp;taskId|任务ID|integer(int64)||
|&emsp;&emsp;translateType|翻译类型|string||
|&emsp;&emsp;targetLanguage|目标语言|string||
|&emsp;&emsp;status|状态: PENDING-待执行, RUNNING-执行中, COMPLETED-已完成, FAILED-失败|string||
|&emsp;&emsp;totalCount|总数|integer(int32)||
|&emsp;&emsp;translatedCount|已翻译数|integer(int32)||
|&emsp;&emsp;skippedCount|跳过数(已有翻译)|integer(int32)||
|&emsp;&emsp;failedCount|失败数|integer(int32)||
|&emsp;&emsp;startTime|开始时间|string(date-time)||
|&emsp;&emsp;endTime|结束时间|string(date-time)||
|&emsp;&emsp;errorMessage|错误信息|string||
|&emsp;&emsp;progress|进度(0-100)|integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"taskId": 1,
			"translateType": "PRODUCT",
			"targetLanguage": "en",
			"status": "RUNNING",
			"totalCount": 1000,
			"translatedCount": 500,
			"skippedCount": 100,
			"failedCount": 10,
			"startTime": "",
			"endTime": "",
			"errorMessage": "",
			"progress": 50
		}
	]
}
```


## 删除任务记录


**接口地址**:`/admin-api/translate-task/delete`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|taskId|任务ID|query|true|integer(int64)||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```