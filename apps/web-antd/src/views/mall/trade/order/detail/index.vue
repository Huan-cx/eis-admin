<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BOrderApi } from '#/api/mall/trade/b2b/order';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import {
  DeliveryTypeEnum,
  DICT_TYPE,
  TradeOrderApprovalStatusEnum,
  TradeOrderPayProgressStatusEnum,
  TradeOrderStatusEnum,
} from '@vben/constants';
import { useTabs } from '@vben/hooks';

import { message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveOrder,
  getExpressTrackList,
  getOrder,
  rejectOrder,
} from '#/api/mall/trade/b2b/order';
import {
  createShipmentFromOrder,
  getShipmentByOrderId,
} from '#/api/mall/trade/orderShipment';
import { useDescription } from '#/components/description';
import { TableAction } from '#/components/table-action';
import { $t } from '#/locales';

import AddressForm from '../modules/address-form.vue';
import ApprovalRejectForm from '../modules/approval-reject-form.vue';
import DeliveryForm from '../modules/delivery-form.vue';
import PaymentForm from '../modules/payment-form.vue';
import PriceForm from '../modules/price-form.vue';
import RemarkForm from '../modules/remark-form.vue';
import {
  useDeliveryInfoSchema,
  useExpressTrackColumns,
  useOperateLogColumns,
  useOrderInfoSchema,
  useOrderPriceSchema,
  useOrderStatusSchema,
  usePaymentColumns,
  useProductColumns,
} from './data';

defineOptions({ name: 'TradeOrderDetail' });

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const loading = ref(false);
const activeTab = ref('basic');
const orderId = ref<number>(Number(route.params.id));
const shipmentExists = ref(false); // 发货单是否已存在
const shipmentId = ref<null | number>(null); // 发货单ID
const order = ref<B2BOrderApi.OrderDetail>({
  id: 0,
  no: '',
  quotationId: 0,
  quotationNo: '',
  userId: 0,
  userName: '',
  status: 0,
  statusName: '',
  approvalStatus: 0,
  approvalStatusName: '',
  payProgressStatus: 0,
  payProgressStatusName: '',
  totalPrice: 0,
  payPrice: 0,
  paidPrice: 0,
  currency: '',
  deliveryType: 0,
  incoterms: '',
  paymentMethod: 0,
  contractNo: '',
  logisticsId: 0,
  logisticsNo: '',
  createTime: '',
  remark: '',
  items: [],
  payments: [],
  logs: [],
});
const expressTrackList = ref<any[]>([]);

const [OrderInfoDescriptions] = useDescription({
  title: $t('trade.order.detail.orderInfo'),
  bordered: false,
  column: 3,
  class: 'mx-4',
  schema: useOrderInfoSchema(),
});

const [OrderStatusDescriptions] = useDescription({
  title: $t('trade.order.detail.orderStatus'),
  bordered: false,
  column: 2,
  class: 'mx-4',
  schema: useOrderStatusSchema(),
});

const [OrderPriceDescriptions] = useDescription({
  title: $t('trade.order.detail.priceInfo'),
  bordered: false,
  column: 4,
  class: 'mx-4',
  schema: useOrderPriceSchema(),
});

const [DeliveryInfoDescriptions] = useDescription({
  title: $t('trade.order.detail.deliveryInfo'),
  bordered: false,
  column: 3,
  class: 'mx-4',
  schema: useDeliveryInfoSchema(),
});

const [ProductGrid, productGridApi] = useVbenVxeGrid({
  gridOptions: {
    cellConfig: {
      height: 60,
    },
    columns: useProductColumns(),
    data: [],
    height: '600',
    border: true,
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<B2BOrderApi.OrderItem>,
});

const [ExpressTrackGrid, expressTrackGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useExpressTrackColumns(),
    data: [],
    border: true,
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions,
});

const [OperateLogGrid, operateLogGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useOperateLogColumns(),
    data: [],
    border: true,
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions,
});

const [PaymentGrid, paymentGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: usePaymentColumns(),
    data: [],
    border: true,
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions,
});

const [DeliveryFormModal] = useVbenModal({
  connectedComponent: DeliveryForm,
  destroyOnClose: true,
});

const [RemarkFormModal, remarkFormModalApi] = useVbenModal({
  connectedComponent: RemarkForm,
  destroyOnClose: true,
});

const [AddressFormModal, addressFormModalApi] = useVbenModal({
  connectedComponent: AddressForm,
  destroyOnClose: true,
});

const [PriceFormModal, priceFormModalApi] = useVbenModal({
  connectedComponent: PriceForm,
  destroyOnClose: true,
});

// 审批驳回弹窗
const [ApprovalRejectModal, approvalRejectModalApi] = useVbenModal({
  connectedComponent: ApprovalRejectForm,
  destroyOnClose: true,
  title: $t('trade.order.approvalForm.rejectTitle'),
});

// 人工付款弹窗
const [PaymentFormModal, paymentFormModalApi] = useVbenModal({
  connectedComponent: PaymentForm,
  destroyOnClose: true,
  title: $t('trade.order.index.manualPay'),
});
/** 获得详情 */
async function getDetail() {
  loading.value = true;
  try {
    const res = await getOrder(orderId.value);
    order.value = {
      ...res,
      logs: res.logs || [],
      payments: res.payments || [],
    };
    productGridApi.setGridOptions({ data: res.items || [] });
    operateLogGridApi.setGridOptions({ data: res.logs || [] });

    // 检查发货单是否存在
    try {
      const shipment = await getShipmentByOrderId(orderId.value);
      if (shipment && shipment.id) {
        shipmentExists.value = true;
        shipmentId.value = shipment.id;
      } else {
        shipmentExists.value = false;
        shipmentId.value = null;
      }
    } catch {
      shipmentExists.value = false;
      shipmentId.value = null;
    }
    paymentGridApi.setGridOptions({ data: res.payments || [] });

    // 如果有物流单号，查询物流轨迹
    if (res.logisticsId) {
      expressTrackList.value = await getExpressTrackList(res.id!);
      expressTrackGridApi.setGridOptions({
        data: expressTrackList.value || [],
      });
    }
  } finally {
    loading.value = false;
  }
}

/** 各种操作 */
const handleRemark = () => {
  remarkFormModalApi.setData(order.value).open();
};

/** 手动创建发货单 */
const handleCreateShipment = async () => {
  try {
    await confirm('确认手动创建发货单？创建后将进入发货管理流程');
    const hideLoading = message.loading({
      content: '创建中...',
      duration: 0,
    });
    const newShipmentId = await createShipmentFromOrder(order.value.id);
    hideLoading();
    message.success('发货单创建成功');
    // 更新状态
    shipmentExists.value = true;
    shipmentId.value = newShipmentId;
    // 跳转到发货管理详情页
    router.push({
      name: 'TradeOrderShipmentDetail',
      params: { id: newShipmentId },
    });
  } catch (error) {
    console.error('创建发货单失败', error);
    message.error('创建发货单失败');
  }
};

/** 发货管理 - 跳转到发货管理详情页 */
const handleShipmentManage = async () => {
  if (shipmentId.value) {
    router.push({
      name: 'TradeOrderShipmentDetail',
      params: { id: shipmentId.value },
    });
    return;
  }
  try {
    const shipment = await getShipmentByOrderId(order.value.id);
    if (shipment && shipment.id) {
      router.push({
        name: 'TradeOrderShipmentDetail',
        params: { id: shipment.id },
      });
    } else {
      message.warning('发货单不存在，请先创建发货单');
    }
  } catch (error) {
    console.error('获取发货单信息失败', error);
    message.error('获取发货单信息失败');
  }
};

const handleUpdateAddress = () => {
  addressFormModalApi.setData(order.value).open();
};

const handleUpdatePrice = () => {
  priceFormModalApi.setData(order.value).open();
};

/** 审批通过 */
async function handleApprove() {
  await confirm('确认审批通过该订单？');
  const hideLoading = message.loading({
    content: $t('trade.order.detail.processing'),
    duration: 0,
  });
  try {
    await approveOrder(order.value.id!);
    message.success($t('trade.order.index.actionMessage.approveSuccess'));
    await getDetail();
  } finally {
    hideLoading();
  }
}

/** 审批驳回 */
function handleReject() {
  approvalRejectModalApi.setData(order.value).open();
}

/** 提交审批驳回 */
async function handleSubmitReject() {
  const formData = approvalRejectModalApi.getData() as {
    id: number;
    reason: string;
  };
  const hideLoading = message.loading({
    content: $t('trade.order.detail.processing'),
    duration: 0,
  });
  try {
    await rejectOrder(order.value.id!, formData.reason);
    approvalRejectModalApi.close();
    message.success($t('trade.order.index.actionMessage.rejectSuccess'));
    await getDetail();
  } finally {
    hideLoading();
  }
}

/** 人工付款 */
function handleManualPay() {
  paymentFormModalApi
    .setData({
      orderId: order.value.id,
      remaining: order.value.payPrice - (order.value.paidPrice || 0),
    })
    .open();
}

/** 提交人工付款 - 成功回调 */
async function handleSubmitPay() {
  message.success($t('trade.order.index.actionMessage.paySuccess'));
  await getDetail();
}

/** 返回列表页 */
function handleBack() {
  tabs.closeCurrentTab();
  router.push({ name: 'TradeOrder' });
}

/** 初始化 */
onMounted(async () => {
  await getDetail();
});
</script>

<template>
  <Page auto-content-height :title="order.no" :loading="loading">
    <template #extra>
      <TableAction
        :actions="[
          {
            label: $t('trade.order.detail.back'),
            type: 'default',
            icon: 'lucide:arrow-left',
            onClick: handleBack,
          },
          {
            label: $t('trade.order.index.approve'),
            type: 'primary',
            icon: 'lucide:check',
            auth: ['trade:order:approval'],
            ifShow: () =>
              order.approvalStatus ===
              TradeOrderApprovalStatusEnum.PENDING.status,
            onClick: handleApprove,
          },
          {
            label: $t('trade.order.index.reject'),
            type: 'default',
            icon: 'lucide:x',
            auth: ['trade:order:approval'],
            ifShow: () =>
              order.approvalStatus ===
              TradeOrderApprovalStatusEnum.PENDING.status,
            onClick: handleReject,
          },
          {
            label: $t('trade.order.detail.updatePrice'),
            type: 'primary',
            auth: ['trade:order:update-price'],
            ifShow: () => order.status === TradeOrderStatusEnum.UNPAID.status,
            onClick: handleUpdatePrice,
          },
          {
            label: $t('trade.order.index.manualPay'),
            type: 'primary',
            icon: 'lucide:credit-card',
            auth: ['trade:order:pay'],
            ifShow: () =>
              order.approvalStatus ===
                TradeOrderApprovalStatusEnum.APPROVED.status &&
              order.payProgressStatus !==
                TradeOrderPayProgressStatusEnum.FULL_PAID.status &&
              order.status !== TradeOrderStatusEnum.CANCELED.status,
            onClick: handleManualPay,
          },
          {
            label: $t('trade.order.detail.remark'),
            type: 'primary',
            auth: ['trade:order:remark'],
            onClick: handleRemark,
          },
          {
            label: '创建发货单',
            type: 'primary',
            icon: 'lucide:package-plus',
            auth: ['trade:order-shipment:create'],
            ifShow: () =>
              !shipmentExists &&
              order.status === TradeOrderStatusEnum.UNDELIVERED.status &&
              order.approvalStatus ===
                TradeOrderApprovalStatusEnum.APPROVED.status,
            onClick: handleCreateShipment,
          },
          {
            label: '发货管理',
            type: 'primary',
            icon: 'lucide:truck',
            auth: ['trade:order:delivery'],
            ifShow: () =>
              shipmentExists &&
              order.status === TradeOrderStatusEnum.UNDELIVERED.status,
            onClick: handleShipmentManage,
          },
          {
            label: $t('trade.order.detail.updateAddress'),
            type: 'primary',
            auth: ['trade:order:update-address'],
            ifShow: () =>
              order.status === TradeOrderStatusEnum.UNDELIVERED.status &&
              order.deliveryType === DeliveryTypeEnum.EXPRESS.type,
            onClick: handleUpdateAddress,
          },

        ]"
      />
    </template>

    <!-- 各种操作的弹窗 -->
    <DeliveryFormModal @success="getDetail" />
    <RemarkFormModal @success="getDetail" />
    <AddressFormModal @success="getDetail" />
    <PriceFormModal @success="getDetail" />
    <ApprovalRejectModal @success="handleSubmitReject" />
    <PaymentFormModal @success="handleSubmitPay" />

    <div class="flex flex-col gap-4">
      <!-- 订单信息 -->
      <div>
        <OrderInfoDescriptions :data="order" />
      </div>
      <!-- 订单状态 -->
      <div>
        <OrderStatusDescriptions :data="order" />
      </div>

      <!-- Tab切换 -->
      <ATabs v-model:active-key="activeTab" type="border-card">
        <ATabPane key="basic" :tab="$t('trade.order.detail.productInfo')">
          <!-- 商品信息 -->
          <div>
            <ProductGrid :table-title="$t('trade.order.detail.productDetail')">
              <template #spuName="{ row }">
                <div class="flex flex-1 flex-col items-start gap-1 text-left">
                  <span class="text-sm">{{ row.spuName }}</span>
                  <div
                    v-if="row.properties && row.properties.length > 0"
                    class="flex flex-wrap gap-1"
                  >
                    <Tag
                      v-for="property in row.properties"
                      :key="property.propertyId!"
                      size="small"
                    >
                      {{ property.propertyName }}: {{ property.valueName }}
                    </Tag>
                  </div>
                </div>
              </template>
            </ProductGrid>
          </div>
          <!-- 费用信息 -->
          <div class="mt-4">
            <OrderPriceDescriptions :data="order" />
          </div>
        </ATabPane>

        <ATabPane key="delivery" :tab="$t('trade.order.detail.deliveryInfo')">
          <!-- 物流信息 -->
          <div>
            <DeliveryInfoDescriptions :data="order" />
          </div>
          <!-- 物流详情 -->
          <div v-if="expressTrackList.length > 0" class="mt-4">
            <ExpressTrackGrid
              :table-title="$t('trade.order.detail.expressTrack')"
            />
          </div>
        </ATabPane>

        <ATabPane key="payment" :tab="$t('trade.order.detail.payment')">
          <PaymentGrid :table-title="$t('trade.order.detail.paymentDetail')">
            <template #toolbarSuffix>
              <AButton
                v-if="
                  order.approvalStatus ===
                    TradeOrderApprovalStatusEnum.APPROVED.status &&
                  order.payProgressStatus !==
                    TradeOrderPayProgressStatusEnum.FULL_PAID.status &&
                  order.status !== TradeOrderStatusEnum.CANCELED.status
                "
                type="primary"
                @click="handleManualPay"
              >
                {{ $t('trade.order.index.manualPay') }}
              </AButton>
            </template>
          </PaymentGrid>
          <AEmpty
            v-if="order.payments && order.payments.length === 0"
            :description="$t('trade.order.detail.noPaymentRecord')"
            class="mt-4"
          />
        </ATabPane>

        <ATabPane key="log" :tab="$t('trade.order.detail.operationLog')">
          <!-- 操作日志 -->
          <div>
            <OperateLogGrid
              :table-title="$t('trade.order.detail.operationLog')"
            >
              <template #userType="{ row }">
                <Tag v-if="row.userType === 0" color="default">
                  {{ $t('trade.order.detail.system') }}
                </Tag>
                <DictTag
                  v-else
                  :type="DICT_TYPE.USER_TYPE"
                  :value="row.userType"
                />
              </template>
            </OperateLogGrid>
          </div>
        </ATabPane>
      </ATabs>
    </div>
  </Page>
</template>
