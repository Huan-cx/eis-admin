<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallOrderApi } from '#/api/mall/trade/order';

import { useRouter } from 'vue-router';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import {
  DeliveryTypeEnum,
  DICT_TYPE,
  TradeOrderStatusEnum,
} from '@vben/constants';
import { fenToYuan } from '@vben/utils';

import { Image, List, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrderPage } from '#/api/mall/trade/order';
import { DictTag } from '#/components/dict-tag';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import AddressForm from './modules/address-form.vue';
import DeliveryForm from './modules/delivery-form.vue';
import RemarkForm from './modules/remark-form.vue';

const { push } = useRouter();

const [DeliveryFormModal, deliveryFormModalApi] = useVbenModal({
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

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: MallOrderApi.Order) {
  push({ name: 'TradeOrderDetail', params: { id: row.id } });
}

/** 发货 */
function handleDelivery(row: MallOrderApi.Order) {
  deliveryFormModalApi.setData(row).open();
}

/** 备注 */
function handleRemark(row: MallOrderApi.Order) {
  remarkFormModalApi.setData(row).open();
}

/** 修改地址 */
function handleUpdateAddress(row: MallOrderApi.Order) {
  addressFormModalApi.setData(row).open();
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
  } as VxeTableGridOptions<MallOrderApi.Order>,
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
    <Grid :table-title="$t('trade.order.index.title')">
      <template #expand_content="{ row }">
        <List item-layout="vertical" :data-source="row.items">
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta>
                <template #title>
                  {{ item.spuName }}
                  <Tag
                    color="blue"
                    v-for="property in item.properties"
                    :key="property.propertyId"
                  >
                    {{ property.propertyName }} : {{ property.valueName }}
                  </Tag>
                </template>
                <template #avatar>
                  <Image :src="item.picUrl" :width="40" :height="40" />
                </template>
                <template #description>
                  {{
                    `${$t('trade.order.index.originalPrice')}：${fenToYuan(item.price)} ${$t('common.yuan')} / ${$t('trade.order.index.quantity')}：${item.count} ${$t('trade.order.index.piece')}`
                  }}
                  |
                  <DictTag
                    :type="DICT_TYPE.TRADE_ORDER_ITEM_AFTER_SALE_STATUS"
                    :value="item.afterSaleStatus"
                  />
                </template>
              </List.Item.Meta>
            </List.Item>
          </template>
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
              label: $t('trade.order.index.delivery'),
              type: 'link',
              ifShow: () =>
                row.deliveryType === DeliveryTypeEnum.EXPRESS.type &&
                row.status === TradeOrderStatusEnum.UNDELIVERED.status,
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
