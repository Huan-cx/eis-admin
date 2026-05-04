import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCommentApi } from '#/api/mall/product/comment';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'spuId',
      label: $t('mall-product.comment.spu'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.spu'),
      },
      rules: 'required',
    },
    {
      fieldName: 'skuId',
      label: $t('mall-product.comment.sku'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.sku'),
      },
      dependencies: {
        triggerFields: ['spuId'],
        show: (values) => !!values.spuId,
      },
      rules: 'required',
    },
    {
      fieldName: 'userAvatar',
      label: $t('mall-product.comment.userAvatar'),
      component: 'ImageUpload',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.userAvatar'),
      },
      rules: 'required',
    },
    {
      fieldName: 'userNickname',
      label: $t('mall-product.comment.userNickname'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.userNickname'),
      },
      rules: 'required',
    },
    {
      fieldName: 'content',
      label: $t('mall-product.comment.content'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.content'),
      },
      rules: 'required',
    },
    {
      fieldName: 'descriptionScores',
      label: $t('mall-product.comment.descriptionScores'),
      component: 'Rate',
      rules: z.number().min(1).max(5).default(5),
    },
    {
      fieldName: 'benefitScores',
      label: $t('mall-product.comment.benefitScores'),
      component: 'Rate',
      rules: z.number().min(1).max(5).default(5),
    },
    {
      fieldName: 'picUrls',
      label: $t('mall-product.comment.picUrls'),
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 9,
        placeholder: $t('mall-product.comment.placeholder.picUrls'),
      },
      rules: 'required',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'replyStatus',
      label: $t('mall-product.comment.replyStatus'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('mall-product.comment.replied'), value: true },
          { label: $t('mall-product.comment.unreplied'), value: false },
        ],
        placeholder: $t('common.pleaseSelect'),
        allowClear: true,
      },
    },
    {
      fieldName: 'spuName',
      label: $t('mall-product.spu.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.spuName'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userNickname',
      label: $t('mall-product.comment.userNickname'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.userNickname'),
        allowClear: true,
      },
    },
    {
      fieldName: 'orderId',
      label: $t('mall-product.comment.orderId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.comment.placeholder.orderId'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('mall-product.comment.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(
  onStatusChange?: (
    newStatus: boolean,
    row: MallCommentApi.Comment,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('mall-product.comment.id'),
      fixed: 'left',
      minWidth: 80,
    },
    {
      field: 'skuPicUrl',
      title: $t('mall-product.comment.skuPicUrl'),
      minWidth: 100,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'spuName',
      title: $t('mall-product.spu.name'),
      minWidth: 250,
    },
    {
      field: 'skuProperties',
      title: $t('mall-product.comment.skuProperties'),
      minWidth: 200,
      formatter: ({ cellValue }) => {
        return cellValue && cellValue.length > 0
          ? cellValue
              .map((item: any) => `${item.propertyName} : ${item.valueName}`)
              .join('\n')
          : '-';
      },
    },
    {
      field: 'userNickname',
      title: $t('mall-product.comment.userNickname'),
      minWidth: 100,
    },
    {
      field: 'descriptionScores',
      title: $t('mall-product.comment.descriptionScore'),
      minWidth: 150,
      slots: {
        default: 'descriptionScores',
      },
    },
    {
      field: 'benefitScores',
      title: $t('mall-product.comment.benefitScore'),
      minWidth: 150,
      slots: {
        default: 'benefitScores',
      },
    },
    {
      field: 'content',
      title: $t('mall-product.comment.content'),
      minWidth: 210,
    },
    {
      field: 'picUrls',
      title: $t('mall-product.comment.picUrls'),
      minWidth: 120,
      cellRender: {
        name: 'CellImages',
      },
    },
    {
      field: 'replyContent',
      title: $t('mall-product.comment.replyContent'),
      minWidth: 250,
    },
    {
      field: 'createTime',
      title: $t('mall-product.comment.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'visible',
      title: $t('mall-product.comment.visible'),
      minWidth: 110,
      align: 'center',
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: true,
          unCheckedValue: false,
        },
      },
    },
    {
      title: $t('common.actions'),
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
