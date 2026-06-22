<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BOrderApi } from '#/api/mall/trade/b2b/order';

import { useRouter } from 'vue-router';

import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
import {
  TradeOrderApprovalStatusEnum,
  TradeOrderPayProgressStatusEnum,
  TradeOrderStatusEnum,
} from '@vben/constants';
import { fenToYuan } from '@vben/utils';

import { List, message, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { approveOrder, getOrderPage } from '#/api/mall/trade/b2b/order';
import {
  createShipmentByOrderId,
  getShipmentByOrderId,
} from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import AddressForm from './modules/address-form.vue';
import ApprovalRejectForm from './modules/approval-reject-form.vue';
import DeliveryForm from './modules/delivery-form.vue';
import PaymentForm from './modules/payment-form.vue';
import RemarkForm from './modules/remark-form.vue';

const { push } = useRouter();

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

const [ApprovalRejectFormModal, approvalRejectFormModalApi] = useVbenModal({
  connectedComponent: ApprovalRejectForm,
  destroyOnClose: true,
});

const [PaymentFormModal, paymentFormModalApi] = useVbenModal({
  connectedComponent: PaymentForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: B2BOrderApi.OrderPageItem) {
  push({ name: 'TradeOrderDetail', params: { id: row.id } });
}

/** 发货 - 跳转到发货管理详情页 */
async function handleDelivery(row: B2BOrderApi.OrderPageItem) {
  // 检查是否已存在发货单
  try {
    const shipment = await getShipmentByOrderId(row.id);
    if (shipment && shipment.id) {
      push({ name: 'TradeOrderShipmentDetail', params: { id: shipment.id } });
    } else {
      // 发货单不存在，询问用户是否手动创建
      try {
        await confirm(
          '该订单尚未创建发货单，是否立即手动创建发货单进入发货管理流程？',
        );
        const newShipmentId = await createShipmentByOrderId(row.id);
        message.success('发货单创建成功');
        push({
          name: 'TradeOrderShipmentDetail',
          params: { id: newShipmentId },
        });
      } catch {
        // 用户取消确认，不做处理
      }
    }
  } catch (error) {
    console.error('获取发货单信息失败', error);
    message.error('获取发货单信息失败');
  }
}

/** 备注 */
function handleRemark(row: B2BOrderApi.OrderPageItem) {
  remarkFormModalApi.setData(row).open();
}

/** 修改地址 */
function handleUpdateAddress(row: B2BOrderApi.OrderPageItem) {
  addressFormModalApi.setData(row).open();
}

/** 审批通过 */
async function handleApprove(row: B2BOrderApi.OrderPageItem) {
  await confirm($t('trade.order.approvalForm.approveTitle'));
  try {
    await approveOrder(row.id);
    message.success($t('trade.order.index.actionMessage.approveSuccess'));
    handleRefresh();
  } catch (error) {
    console.error(error);
  }
}

/** 审批驳回 */
function handleReject(row: B2BOrderApi.OrderPageItem) {
  approvalRejectFormModalApi.setData({ id: row.id }).open();
}

/** 人工付款 */
function handleManualPay(row: B2BOrderApi.OrderPageItem) {
  paymentFormModalApi
    .setData({
      orderId: row.id,
      remaining: row.payPrice - (row.paidPrice || 0),
    })
    .open();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    expandConfig: {
      trigger: 'row',
      expandAll: true,
      padding: true,
    },
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getOrderPage({
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
  } as VxeTableGridOptions<B2BOrderApi.OrderPageItem>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        :title="$t('trade.order.index.doc1')"
        url="https://doc.iocoder.cn/mall/trade-order/"
      />
      <DocAlert
        :title="$t('trade.order.index.doc2')"
        url="https://doc.iocoder.cn/mall/trade-cart/"
      />
    </template>

    <DeliveryFormModal @success="handleRefresh" />
    <RemarkFormModal @success="handleRefresh" />
    <AddressFormModal @success="handleRefresh" />
    <ApprovalRejectFormModal @success="handleRefresh" />
    <PaymentFormModal @success="handleRefresh" />

    <Grid :table-title="$t('trade.order.index.title')">
      <template #expand_content="{ row }">
        <List item-layout="vertical" :data-source="[]">
          <List.Item>
            <List.Item.Meta>
              <template #title>
                <div class="flex items-center gap-4">
                  <span class="font-medium">订单号: {{ row.no }}</span>
                  <Tag color="blue">
                    审批状态: {{ row.approvalStatusName }}
                  </Tag>
                  <Tag color="green">
                    付款进度: {{ row.payProgressStatusName }}
                  </Tag>
                </div>
              </template>
              <template #avatar>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded bg-gray-100"
                >
                  <span class="text-lg">📦</span>
                </div>
              </template>
              <template #description>
                <div class="space-y-1">
                  <div class="flex gap-4">
                    <span>总金额: ¥{{ fenToYuan(row.totalPrice) }}</span>
                    <span>已付: ¥{{ fenToYuan(row.paidPrice || 0) }}</span>
                    <span>币种: {{ row.currency }}</span>
                  </div>
                  <div>用户: {{ row.userName }}</div>
                </div>
              </template>
            </List.Item.Meta>
          </List.Item>
        </List>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['trade:order:query'],
              onClick: handleDetail.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('trade.order.index.approve'),
              type: 'link',
              auth: ['trade:order:approval'],
              ifShow: () =>
                row.approvalStatus ===
                TradeOrderApprovalStatusEnum.PENDING.status,
              onClick: handleApprove.bind(null, row),
            },
            {
              label: $t('trade.order.index.reject'),
              type: 'link',
              auth: ['trade:order:approval'],
              ifShow: () =>
                row.approvalStatus ===
                TradeOrderApprovalStatusEnum.PENDING.status,
              onClick: handleReject.bind(null, row),
            },
            {
              label: $t('trade.order.index.manualPay'),
              type: 'link',
              auth: ['trade:order:pay'],
              ifShow: () =>
                row.approvalStatus ===
                  TradeOrderApprovalStatusEnum.APPROVED.status &&
                row.payProgressStatus !==
                  TradeOrderPayProgressStatusEnum.FULL_PAID.status &&
                row.status !== TradeOrderStatusEnum.CANCELED.status,
              onClick: handleManualPay.bind(null, row),
            },
            {
              label: '发货管理',
              type: 'link',
              auth: ['trade:order:delivery'],
              ifShow: () =>
                row.status === TradeOrderStatusEnum.UNDELIVERED.status &&
                row.approvalStatus ===
                  TradeOrderApprovalStatusEnum.APPROVED.status,
              onClick: handleDelivery.bind(null, row),
            },
            {
              label: $t('trade.order.index.remark'),
              type: 'link',
              onClick: handleRemark.bind(null, row),
            },
            {
              label: $t('trade.order.index.updateAddress'),
              type: 'link',
              ifShow: () =>
                row.status === TradeOrderStatusEnum.UNDELIVERED.status,
              onClick: handleUpdateAddress.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
