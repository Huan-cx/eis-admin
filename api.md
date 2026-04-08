

## 修改订单收货地址


**接口地址**:`/admin-api/trade/order/update-address`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 1,
  "receiverName": "z张三",
  "receiverPhone": 13800000000,
  "receiverAddress": {
    "useDifferentBillingAddress": true,
    "firstName": "",
    "lastName": "",
    "companyName": "",
    "address": "",
    "street": "",
    "city": "",
    "state": "",
    "country": "",
    "postcode": "",
    "email": "",
    "phone": "",
    "vat": "",
    "eori": ""
  },
  "billingAddress": {
    "useDifferentBillingAddress": true,
    "firstName": "",
    "lastName": "",
    "companyName": "",
    "address": "",
    "street": "",
    "city": "",
    "state": "",
    "country": "",
    "postcode": "",
    "email": "",
    "phone": "",
    "vat": "",
    "eori": ""
  },
  "businessAddress": {
    "useDifferentBillingAddress": true,
    "firstName": "",
    "lastName": "",
    "companyName": "",
    "address": "",
    "street": "",
    "city": "",
    "state": "",
    "country": "",
    "postcode": "",
    "email": "",
    "phone": "",
    "vat": "",
    "eori": ""
  }
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | ------ | ----- | -------- | -------- | ------ |
|tradeOrderUpdateAddressReqVO|管理后台 - 订单修改地址 Request VO|body|true|TradeOrderUpdateAddressReqVO|TradeOrderUpdateAddressReqVO|
|&emsp;&emsp;id|订单编号||true|integer(int64)||
|&emsp;&emsp;receiverName|收件人名称||true|string||
|&emsp;&emsp;receiverPhone|收件人电话||true|string||
|&emsp;&emsp;receiverAddress|收件人地址||false|TradeOrderAddressReqVO|TradeOrderAddressReqVO|
|&emsp;&emsp;&emsp;&emsp;useDifferentBillingAddress|是否使用不同的账单地址||false|boolean||
|&emsp;&emsp;&emsp;&emsp;firstName|First Name||false|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name||false|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称||false|string||
|&emsp;&emsp;&emsp;&emsp;address|地址||true|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址||true|string||
|&emsp;&emsp;&emsp;&emsp;city|城市||true|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省||true|string||
|&emsp;&emsp;&emsp;&emsp;country|国家||true|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码||true|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话||true|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号||false|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码||false|string||
|&emsp;&emsp;billingAddress|账单地址||false|TradeOrderAddressReqVO|TradeOrderAddressReqVO|
|&emsp;&emsp;&emsp;&emsp;useDifferentBillingAddress|是否使用不同的账单地址||false|boolean||
|&emsp;&emsp;&emsp;&emsp;firstName|First Name||false|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name||false|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称||false|string||
|&emsp;&emsp;&emsp;&emsp;address|地址||true|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址||true|string||
|&emsp;&emsp;&emsp;&emsp;city|城市||true|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省||true|string||
|&emsp;&emsp;&emsp;&emsp;country|国家||true|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码||true|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话||true|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号||false|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码||false|string||
|&emsp;&emsp;businessAddress|商业地址||false|TradeOrderAddressReqVO|TradeOrderAddressReqVO|
|&emsp;&emsp;&emsp;&emsp;useDifferentBillingAddress|是否使用不同的账单地址||false|boolean||
|&emsp;&emsp;&emsp;&emsp;firstName|First Name||false|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name||false|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称||false|string||
|&emsp;&emsp;&emsp;&emsp;address|地址||true|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址||true|string||
|&emsp;&emsp;&emsp;&emsp;city|城市||true|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省||true|string||
|&emsp;&emsp;&emsp;&emsp;country|国家||true|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码||true|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话||true|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号||false|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码||false|string||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||boolean||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": true
}
```


## 获得交易订单详情


**接口地址**:`/admin-api/trade/order/get-detail`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|订单编号|query|true|integer(int64)||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultTradeOrderDetailRespVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | ------ | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||TradeOrderDetailRespVO|TradeOrderDetailRespVO|
|&emsp;&emsp;id|订单编号|integer(int64)||
|&emsp;&emsp;no|订单流水号|string||
|&emsp;&emsp;createTime|下单时间|string(date-time)||
|&emsp;&emsp;type|订单类型|integer(int32)||
|&emsp;&emsp;terminal|订单来源|integer(int32)||
|&emsp;&emsp;userId|用户编号|integer(int64)||
|&emsp;&emsp;userIp|用户 IP|string||
|&emsp;&emsp;userRemark|用户备注|string||
|&emsp;&emsp;status|订单状态|integer(int32)||
|&emsp;&emsp;productCount|购买的商品数量|integer(int32)||
|&emsp;&emsp;finishTime|订单完成时间|string(date-time)||
|&emsp;&emsp;cancelTime|订单取消时间|string(date-time)||
|&emsp;&emsp;cancelType|取消类型|integer(int32)||
|&emsp;&emsp;remark|商家备注|string||
|&emsp;&emsp;payOrderId|支付订单编号|integer(int64)||
|&emsp;&emsp;payStatus|是否已支付|boolean||
|&emsp;&emsp;payTime|付款时间|string(date-time)||
|&emsp;&emsp;payChannelCode|支付渠道|string||
|&emsp;&emsp;totalPrice|商品原价（总）|integer(int32)||
|&emsp;&emsp;discountPrice|订单优惠（总）|integer(int32)||
|&emsp;&emsp;deliveryPrice|运费金额|integer(int32)||
|&emsp;&emsp;adjustPrice|订单调价（总）|integer(int32)||
|&emsp;&emsp;payPrice|应付金额（总）|integer(int32)||
|&emsp;&emsp;deliveryType|配送方式|integer(int32)||
|&emsp;&emsp;pickUpStoreId|自提门店|integer(int64)||
|&emsp;&emsp;pickUpVerifyCode|自提核销码|integer(int64)||
|&emsp;&emsp;deliveryTemplateId|配送模板编号|integer(int64)||
|&emsp;&emsp;logisticsId|发货物流公司编号|integer(int64)||
|&emsp;&emsp;logisticsNo|发货物流单号|string||
|&emsp;&emsp;deliveryTime|发货时间|string(date-time)||
|&emsp;&emsp;receiveTime|收货时间|string(date-time)||
|&emsp;&emsp;receiverName|收件人名称|string||
|&emsp;&emsp;receiverPhone|收件人电话|string||
|&emsp;&emsp;receiverAddress|收件人地址|TradeOrderAddressRespVO|TradeOrderAddressRespVO|
|&emsp;&emsp;&emsp;&emsp;firstName|First Name|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称|string||
|&emsp;&emsp;&emsp;&emsp;address|地址|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址|string||
|&emsp;&emsp;&emsp;&emsp;city|城市|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省|string||
|&emsp;&emsp;&emsp;&emsp;country|国家|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码|string||
|&emsp;&emsp;billingAddress|账单地址|TradeOrderAddressRespVO|TradeOrderAddressRespVO|
|&emsp;&emsp;&emsp;&emsp;firstName|First Name|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称|string||
|&emsp;&emsp;&emsp;&emsp;address|地址|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址|string||
|&emsp;&emsp;&emsp;&emsp;city|城市|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省|string||
|&emsp;&emsp;&emsp;&emsp;country|国家|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码|string||
|&emsp;&emsp;businessAddress|商业地址|TradeOrderAddressRespVO|TradeOrderAddressRespVO|
|&emsp;&emsp;&emsp;&emsp;firstName|First Name|string||
|&emsp;&emsp;&emsp;&emsp;lastName|Last Name|string||
|&emsp;&emsp;&emsp;&emsp;companyName|公司名称|string||
|&emsp;&emsp;&emsp;&emsp;address|地址|string||
|&emsp;&emsp;&emsp;&emsp;street|街道地址|string||
|&emsp;&emsp;&emsp;&emsp;city|城市|string||
|&emsp;&emsp;&emsp;&emsp;state|州/省|string||
|&emsp;&emsp;&emsp;&emsp;country|国家|string||
|&emsp;&emsp;&emsp;&emsp;postcode|邮政编码|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;&emsp;&emsp;phone|电话|string||
|&emsp;&emsp;&emsp;&emsp;vat|VAT 税号|string||
|&emsp;&emsp;&emsp;&emsp;eori|EORI 号码|string||
|&emsp;&emsp;afterSaleStatus|售后状态|integer(int32)||
|&emsp;&emsp;refundPrice|退款金额|integer(int32)||
|&emsp;&emsp;couponId|优惠劵编号|integer(int64)||
|&emsp;&emsp;couponPrice|优惠劵减免金额|integer(int32)||
|&emsp;&emsp;pointPrice|积分抵扣的金额|integer(int32)||
|&emsp;&emsp;vipPrice|VIP 减免金额|integer(int32)||
|&emsp;&emsp;brokerageUserId|推广人编号|integer(int64)||
|&emsp;&emsp;items||array|Item|
|&emsp;&emsp;&emsp;&emsp;skuId|商品 SKU 编号|integer(int64)||
|&emsp;&emsp;&emsp;&emsp;count|购买数量|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;cartId|购物车项的编号|integer(int64)||
|&emsp;&emsp;user||MemberUserRespVO|MemberUserRespVO|
|&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer(int64)||
|&emsp;&emsp;&emsp;&emsp;nickname|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;avatar|用户头像|string||
|&emsp;&emsp;brokerageUser||MemberUserRespVO|MemberUserRespVO|
|&emsp;&emsp;&emsp;&emsp;id|用户 ID|integer(int64)||
|&emsp;&emsp;&emsp;&emsp;nickname|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;avatar|用户头像|string||
|&emsp;&emsp;logs||array|OrderLog|
|&emsp;&emsp;&emsp;&emsp;content|操作详情|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;&emsp;&emsp;userType|用户类型|integer(int32)||
|&emsp;&emsp;receiverAreaName|收件人地区名字|string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": 1024,
		"no": 1146347329394184195,
		"createTime": "",
		"type": 1,
		"terminal": 1,
		"userId": 2048,
		"userIp": "127.0.0.1",
		"userRemark": "你猜",
		"status": 1,
		"productCount": 10,
		"finishTime": "",
		"cancelTime": "",
		"cancelType": 10,
		"remark": "你猜一下",
		"payOrderId": 1024,
		"payStatus": true,
		"payTime": "",
		"payChannelCode": "wx_lite",
		"totalPrice": 1000,
		"discountPrice": 100,
		"deliveryPrice": 100,
		"adjustPrice": 100,
		"payPrice": 1000,
		"deliveryType": 10,
		"pickUpStoreId": 10,
		"pickUpVerifyCode": 10,
		"deliveryTemplateId": 1024,
		"logisticsId": 1024,
		"logisticsNo": 1024,
		"deliveryTime": "",
		"receiveTime": "",
		"receiverName": "张三",
		"receiverPhone": 13800138000,
		"receiverAddress": {
			"firstName": "",
			"lastName": "",
			"companyName": "",
			"address": "",
			"street": "",
			"city": "",
			"state": "",
			"country": "",
			"postcode": "",
			"email": "",
			"phone": "",
			"vat": "",
			"eori": ""
		},
		"billingAddress": {
			"firstName": "",
			"lastName": "",
			"companyName": "",
			"address": "",
			"street": "",
			"city": "",
			"state": "",
			"country": "",
			"postcode": "",
			"email": "",
			"phone": "",
			"vat": "",
			"eori": ""
		},
		"businessAddress": {
			"firstName": "",
			"lastName": "",
			"companyName": "",
			"address": "",
			"street": "",
			"city": "",
			"state": "",
			"country": "",
			"postcode": "",
			"email": "",
			"phone": "",
			"vat": "",
			"eori": ""
		},
		"afterSaleStatus": 1,
		"refundPrice": 100,
		"couponId": 1024,
		"couponPrice": 100,
		"pointPrice": 100,
		"vipPrice": 888,
		"brokerageUserId": 1,
		"items": [
			{
				"skuId": 2048,
				"count": 1,
				"cartId": 1024
			}
		],
		"user": {
			"id": 1,
			"nickname": "芋道源码",
			"avatar": "https://www.iocoder.cn/xxx.png"
		},
		"brokerageUser": {
			"id": 1,
			"nickname": "芋道源码",
			"avatar": "https://www.iocoder.cn/xxx.png"
		},
		"logs": [
			{
				"content": "订单发货",
				"createTime": "2023-06-01 10:50:20",
				"userType": 1
			}
		],
		"receiverAreaName": "上海 上海市 普陀区"
	}
}
```



## 获得用户收件地址列表


**接口地址**:`/admin-api/member/address/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户编号|query|true|integer(int64)||
|tenant-id|租户编号|header|false|integer(int32)||
|Authorization|认证 Token|header|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|CommonResultListAddressRespVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|AddressRespVO|
|&emsp;&emsp;name|收件人名称|string||
|&emsp;&emsp;companyName|公司名称|string||
|&emsp;&emsp;address|地址|string||
|&emsp;&emsp;city|城市|string||
|&emsp;&emsp;state|州/省|string||
|&emsp;&emsp;country|国家代码|string||
|&emsp;&emsp;postcode|邮政编码|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;phone|电话|string||
|&emsp;&emsp;street|街道地址|string||
|&emsp;&emsp;defaultStatus|是否默认|boolean||
|&emsp;&emsp;type|地址类型|integer(int32)||
|&emsp;&emsp;vat|VAT税号|string||
|&emsp;&emsp;eori|EORI号码|string||
|&emsp;&emsp;id|收件地址编号|integer(int64)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"name": "张三",
			"companyName": "",
			"address": "",
			"city": "",
			"state": "",
			"country": "CN",
			"postcode": "",
			"email": "",
			"phone": "",
			"street": "",
			"defaultStatus": 2,
			"type": 1,
			"vat": "",
			"eori": "",
			"id": 7380,
			"createTime": ""
		}
	]
}
```
