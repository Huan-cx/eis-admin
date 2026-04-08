<script lang="ts" setup>
import type { VxeTableGridOptions } from "#/adapter/vxe-table";
import { useVbenVxeGrid } from "#/adapter/vxe-table";
import type { MemberAddressApi } from "#/api/member/address";
import { getAddressList } from "#/api/member/address";

import { DICT_TYPE } from "@vben/constants";

const props = defineProps<{
  userId: number;
}>();

const columns = [
  {
      field: 'id',
      title: '地址编号',
      minWidth: 100,
    },

  {
    field: 'firstName',
    title: '收件人名字',
    minWidth: 100,
  },
  {
    field: 'lastName',
    title: '收件人姓氏',
    minWidth: 100,
  },
  {
    field: 'companyName',
    title: '公司名称',
    minWidth: 120,
  },
  {
    field: 'phone',
    title: '电话',
    minWidth: 130,
  },
  {
    field: 'email',
    title: '邮箱',
    minWidth: 150,
  },
  {
    field: 'country',
    title: '国家代码',
    minWidth: 100,
  },
  {
    field: 'state',
    title: '州/省',
    minWidth: 100,
  },
  {
    field: 'city',
    title: '城市',
    minWidth: 100,
  },
  {
    field: 'street',
    title: '街道地址',
    minWidth: 150,
  },
  {
    field: 'address',
    title: '详细地址',
    minWidth: 150,
  },
  {
      field: 'postcode',
      title: '邮政编码',
      minWidth: 100,
    },
    {
      field: 'vat',
      title: '增值税号',
      minWidth: 150,
    },
    {
      field: 'eori',
      title: '经济经营者注册和识别号',
      minWidth: 180,
    },
    {
      field: 'type',
      title: '地址类型',
      minWidth: 100,
      slots: {
        default: ({ row } : { row: MemberAddressApi.Address }) => {
          const typeMap = {
            1: '收货地址',
            2: '账单地址',
            3: '商业地址'
          };
          return typeMap[row.type as keyof typeof typeMap] || '-';
        },
      },
    },
  {
    field: 'defaultStatus',
    title: '是否默认',
    minWidth: 100,
    cellRender: {
      name: 'CellDict',
      props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
    },
  },
  {
    field: 'createTime',
    title: '创建时间',
    formatter: 'formatDateTime',
    minWidth: 160,
  },
];

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns,
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getAddressList({
            userId: props.userId,
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
  } as VxeTableGridOptions<MemberAddressApi.Address>,
});
</script>

<template>
  <Grid />
</template>
