<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCouponTemplateApi } from '#/api/mall/promotion/coupon/couponTemplate';

import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { CommonStatusEnum } from '@vben/constants';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCouponTemplate,
  getCouponTemplatePage,
  updateCouponTemplateStatus,
} from '#/api/mall/promotion/coupon/couponTemplate';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

defineOptions({ name: 'PromotionCouponTemplate' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 编辑优惠券模板 */
function handleEdit(row: MallCouponTemplateApi.CouponTemplate) {
  formModalApi.setData(row).open();
}

/** 创建优惠券模板 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 删除优惠券模板 */
async function handleDelete(row: MallCouponTemplateApi.CouponTemplate) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteCouponTemplate(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 优惠券模板状态修改 */
async function handleStatusChange(
  newStatus: number,
  row: MallCouponTemplateApi.CouponTemplate,
): Promise<boolean | undefined> {
  return new Promise((resolve, reject) => {
    confirm({
      content: $t('promotion.coupon.template.statusChangeConfirm', [row.name, newStatus === CommonStatusEnum.ENABLE ? $t('promotion.coupon.template.status.enable') : $t('promotion.coupon.template.status.disable')]),
    })
      .then(async () => {
        // 更新优惠券模板状态
        await updateCouponTemplateStatus(row.id!, newStatus);
        // 提示并返回成功
        message.success($t('ui.actionMessage.operationSuccess'));
        resolve(true);
      })
      .catch(() => {
        reject(new Error($t('promotion.coupon.template.cancelOperation')));
      });
  });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(handleStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getCouponTemplatePage({
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
  } as VxeTableGridOptions<MallCouponTemplateApi.CouponTemplate>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【营销】优惠劵"
        url="https://doc.iocoder.cn/mall/promotion-coupon/"
      />
    </template>

    <FormModal @success="handleRefresh" />
    <Grid :table-title="$t('promotion.coupon.template.list')">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', [$t('promotion.coupon.template.title')]),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:coupon-template:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['promotion:coupon-template:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:coupon-template:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
