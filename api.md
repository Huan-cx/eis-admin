

## 创建邮件模版


**接口地址**:`/admin-api/system/mail-template/create`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 1024,
  "name": "测试名字",
  "code": "test",
  "accountId": 1,
  "nickname": "芋头",
  "title": "注册成功",
  "content": "你好，注册成功啦",
  "status": 1,
  "remark": "奥特曼",
  "fixed": true,
  "type": 1
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|mailTemplateSaveReqVO|管理后台 - 邮件模版创建/修改 Request VO|body|true|MailTemplateSaveReqVO|MailTemplateSaveReqVO|
|&emsp;&emsp;id|编号||false|integer(int64)||
|&emsp;&emsp;name|模版名称||true|string||
|&emsp;&emsp;code|模版编号||true|string||
|&emsp;&emsp;accountId|发送的邮箱账号编号||true|integer(int64)||
|&emsp;&emsp;nickname|发送人名称||false|string||
|&emsp;&emsp;title|标题||true|string||
|&emsp;&emsp;content|内容||true|string||
|&emsp;&emsp;status|状态，参见 CommonStatusEnum 枚举||true|integer(int32)||
|&emsp;&emsp;remark|备注||false|string||
|&emsp;&emsp;fixed|是否固定||false|boolean||
|&emsp;&emsp;type|类型||true|integer(int32)||
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
