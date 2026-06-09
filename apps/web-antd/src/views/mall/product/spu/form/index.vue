<script lang="ts" setup>
import type { MallI18nApi } from '#/api/mall/product/i18n';
import type { MallSpuApi } from '#/api/mall/product/spu';
import type {
  PropertyAndValues,
  RuleConfig,
} from '#/views/mall/product/spu/components';

import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { convertToInteger, formatToFraction } from '@vben/utils';

import { Button, Card, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getSpuI18nList, saveSpuI18n } from '#/api/mall/product/i18n';
import { createSpu, getSpu, updateSpu } from '#/api/mall/product/spu';
import I18nEditor from '#/components/i18n-editor/I18nEditor.vue';
import { $t } from '#/locales';
import { getPropertyList, SkuList } from '#/views/mall/product/spu/components';

import {
  useDeliveryFormSchema,
  useDescriptionFormSchema,
  useInfoFormSchema,
  useOtherFormSchema,
  useSkuFormSchema,
} from './data';
import ProductAttributes from './modules/product-attributes.vue';
import ProductPropertyAddForm from './modules/product-property-add-form.vue';

const spuId = ref<number>();
const { params, name } = useRoute();
const { closeCurrentTab } = useTabs();
const activeTabName = ref('info');
const formLoading = ref(false);
const isDetail = ref(name === 'ProductSpuDetail');
const skuListRef = ref();
const i18nData = ref<MallI18nApi.TranslationItem[]>([]);
const i18nEditorRef = ref<InstanceType<typeof I18nEditor>>();

const formData = ref<MallSpuApi.Spu>({
  name: '',
  categoryId: undefined,
  keyword: '',
  picUrl: '',
  sliderPicUrls: [],
  introduction: '',
  deliveryTypes: [],
  deliveryTemplateId: undefined,
  brandId: undefined,
  specType: false,
  subCommissionType: false,
  skus: [
    {
      name: '',
      price: 0,
      marketPrice: 0,
      costPrice: 0,
      barCode: '',
      picUrl: '',
      stock: 0,
      weight: 0,
      volume: 0,
      firstBrokeragePrice: 0,
      secondBrokeragePrice: 0,
    },
  ],
  description: '',
  sort: 0,
  giveIntegral: 0,
  virtualSalesCount: 0,
});
const propertyList = ref<PropertyAndValues[]>([]);
const ruleConfig: RuleConfig[] = [
  {
    name: 'stock',
    rule: (arg: number) => arg >= 0,
    message: $t('mall-product.spu.validation.stock'),
  },
  {
    name: 'price',
    rule: (arg: number) => arg >= 0.01,
    message: $t('mall-product.spu.validation.price'),
  },
  {
    name: 'marketPrice',
    rule: (arg: number) => arg >= 0.01,
    message: $t('mall-product.spu.validation.marketPrice'),
  },
  {
    name: 'costPrice',
    rule: (arg: number) => arg >= 0.01,
    message: $t('mall-product.spu.validation.costPrice'),
  },
];
const [InfoForm, infoFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useInfoFormSchema(),
  showDefaultActions: false,
});

const [SkuForm, skuFormApi] = useVbenForm({
  commonConfig: {
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useSkuFormSchema(propertyList.value, isDetail.value),
  showDefaultActions: false,
  handleValuesChange: (values, fieldsChanged) => {
    if (fieldsChanged.includes('subCommissionType')) {
      formData.value.subCommissionType = values.subCommissionType;
      handleChangeSubCommissionType();
    }
    if (fieldsChanged.includes('specType')) {
      formData.value.specType = values.specType;
      handleChangeSpec();
    }
  },
});

const [ProductPropertyAddFormModal, productPropertyAddFormApi] = useVbenModal({
  connectedComponent: ProductPropertyAddForm,
  destroyOnClose: true,
});

const [DeliveryForm, deliveryFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useDeliveryFormSchema(),
  showDefaultActions: false,
});

const [DescriptionForm, descriptionFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'vertical',
  schema: useDescriptionFormSchema(),
  showDefaultActions: false,
});

const [OtherForm, otherFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useOtherFormSchema(),
  showDefaultActions: false,
});

function handleTabChange(key: string) {
  activeTabName.value = key;
}

async function handleSubmit() {
  const formValues: MallSpuApi.Spu = await infoFormApi
    .merge(skuFormApi)
    .merge(deliveryFormApi)
    .merge(descriptionFormApi)
    .merge(otherFormApi)
    .submitAllForm(true);
  formValues.skus = formData.value.skus;
  if (!formValues.name || formValues.name.trim() === '') {
    message.error($t('mall-product.spu.validation.nameEmpty'));
    return;
  }
  if (formValues.skus) {
    try {
      skuListRef.value.validateSku();
    } catch {
      message.error($t('mall-product.spu.validation.skuIncomplete'));
      return;
    }
    formValues.skus.forEach((item) => {
      item.name = formValues.name;
      item.price = convertToInteger(item.price);
      item.marketPrice = convertToInteger(item.marketPrice);
      item.costPrice = convertToInteger(item.costPrice);
      item.firstBrokeragePrice = convertToInteger(item.firstBrokeragePrice);
      item.secondBrokeragePrice = convertToInteger(item.secondBrokeragePrice);
    });
  }
  const newSliderPicUrls: any[] = [];
  formValues.sliderPicUrls!.forEach((item: any) => {
    typeof item === 'object'
      ? newSliderPicUrls.push(item.url)
      : newSliderPicUrls.push(item);
  });
  formValues.sliderPicUrls = newSliderPicUrls;

  await (spuId.value ? updateSpu(formValues) : createSpu(formValues))
    .then(() => {
      getDetail();
      message.success($t('ui.actionMessage.operationSuccess'));
    })
    .catch(() => {
      message.error($t('ui.actionMessage.operationFailed'));
    });
}

async function getDetail() {
  if (isDetail.value) {
    isDetail.value = true;
    infoFormApi.setDisabled(true);
    skuFormApi.setDisabled(true);
    deliveryFormApi.setDisabled(true);
    descriptionFormApi.setDisabled(true);
    otherFormApi.setDisabled(true);
  }
  propertyList.value = getPropertyList(formData.value);
  formLoading.value = true;
  try {
    const res = await getSpu(spuId.value!);
    res.skus?.forEach((item) => {
      item.price = formatToFraction(item.price);
      item.marketPrice = formatToFraction(item.marketPrice);
      item.costPrice = formatToFraction(item.costPrice);
      item.firstBrokeragePrice = formatToFraction(item.firstBrokeragePrice);
      item.secondBrokeragePrice = formatToFraction(item.secondBrokeragePrice);
    });
    formData.value = res;
    infoFormApi.setValues(res).then();
    skuFormApi.setValues(res).then();
    deliveryFormApi.setValues(res).then();
    descriptionFormApi.setValues(res).then();
    otherFormApi.setValues(res).then();
    propertyList.value = getPropertyList(formData.value);
  } finally {
    formLoading.value = false;
  }
}

function openPropertyAddForm() {
  productPropertyAddFormApi.open();
}

async function loadI18nData() {
  if (!spuId.value) {
    i18nData.value = [];
    return;
  }
  try {
    i18nData.value = await getSpuI18nList(spuId.value);
  } catch (error) {
    console.error('加载国际化数据失败:', error);
    i18nData.value = [];
  }
}

function openI18nEditor() {
  loadI18nData().then(() => {
    i18nEditorRef.value?.modalApi.open();
  });
}

function generateSkus(propertyList: PropertyAndValues[]) {
  skuListRef.value.generateTableData(propertyList);
}

function handleChangeSubCommissionType() {
  for (const item of formData.value.skus!) {
    item.firstBrokeragePrice = 0;
    item.secondBrokeragePrice = 0;
  }
}

function handleChangeSpec() {
  if (isDetail.value || formData.value.id) {
    return;
  }
  propertyList.value = [];
  formData.value.skus = [
    {
      name: '',
      price: 0,
      marketPrice: 0,
      costPrice: 0,
      barCode: '',
      picUrl: '',
      stock: 0,
      weight: 0,
      volume: 0,
      firstBrokeragePrice: 0,
      secondBrokeragePrice: 0,
    },
  ];
}

watch(
  propertyList,
  () => {
    skuFormApi.updateSchema(
      useSkuFormSchema(propertyList.value, isDetail.value),
    );
  },
  { deep: true },
);

onMounted(async () => {
  spuId.value = params.id as unknown as number;
  if (!spuId.value) {
    return;
  }
  await getDetail();
});
</script>

<template>
  <div>
    <ProductPropertyAddFormModal :property-list="propertyList" />

    <Page auto-content-height>
      <Card
        class="h-full w-full"
        :loading="formLoading"
        :tab-list="[
          {
            key: 'info',
            tab: $t('mall-product.spu.form.basic'),
          },
          {
            key: 'sku',
            tab: $t('mall-product.spu.form.sku'),
          },
          {
            key: 'delivery',
            tab: $t('mall-product.spu.form.delivery'),
          },
          {
            key: 'description',
            tab: $t('mall-product.spu.form.description'),
          },
          {
            key: 'other',
            tab: $t('mall-product.spu.form.other'),
          },
        ]"
        :active-key="activeTabName"
        @tab-change="handleTabChange"
      >
        <template #tabBarExtraContent>
          <Space>
            <Button
              v-if="!isDetail && spuId"
              type="default"
              @click="openI18nEditor"
            >
              {{ $t('mall-product.i18n.title') }}
            </Button>
            <Button type="primary" v-if="!isDetail" @click="handleSubmit">
              {{ $t('common.save') }}
            </Button>
            <Button type="default" v-else @click="() => closeCurrentTab()">
              {{ $t('common.backToList') }}
            </Button>
          </Space>
        </template>

        <InfoForm class="w-3/5" v-show="activeTabName === 'info'" />
        <SkuForm class="w-full" v-show="activeTabName === 'sku'">
          <template #singleSkuList>
            <SkuList
              ref="skuListRef"
              class="w-full"
              :is-detail="isDetail"
              :prop-form-data="formData"
              :property-list="propertyList"
              :rule-config="ruleConfig"
            />
          </template>
          <template #productAttributes>
            <div>
              <Button class="mb-10px mr-15px" @click="openPropertyAddForm">
                {{ $t('mall-product.spu.form.addProperty') }}
              </Button>
              <ProductAttributes
                :is-detail="isDetail"
                :property-list="propertyList"
                @success="generateSkus"
              />
            </div>
          </template>
          <template #batchSkuList>
            <SkuList
              :is-batch="true"
              :is-detail="isDetail"
              :prop-form-data="formData"
              :property-list="propertyList"
            />
          </template>
          <template #multiSkuList>
            <SkuList
              ref="skuListRef"
              :is-detail="isDetail"
              :prop-form-data="formData"
              :property-list="propertyList"
              :rule-config="ruleConfig"
            />
          </template>
        </SkuForm>
        <DeliveryForm class="w-3/5" v-show="activeTabName === 'delivery'" />
        <DescriptionForm
          class="w-3/5"
          v-show="activeTabName === 'description'"
        />
        <OtherForm class="w-3/5" v-show="activeTabName === 'other'" />
      </Card>
    </Page>

    <I18nEditor
      v-if="spuId"
      ref="i18nEditorRef"
      :title="$t('mall-product.i18n.title')"
      :entity-id="spuId"
      :fields="[
        { key: 'name', label: $t('mall-product.spu.name'), type: 'input' },
        {
          key: 'keyword',
          label: $t('mall-product.spu.keyword'),
          type: 'input',
        },
        {
          key: 'introduction',
          label: $t('mall-product.spu.introduction'),
          type: 'input',
        },
        {
          key: 'description',
          label: $t('mall-product.spu.description'),
          type: 'richText',
        },
        {
          key: 'metaTitle',
          label: $t('mall-product.spu.form.metaTitle'),
          type: 'input',
        },
        {
          key: 'metaDescription',
          label: $t('mall-product.spu.form.metaDescription'),
          type: 'textarea',
        },
      ]"
      :default-data="{
        name: formData.name ?? '',
        keyword: formData.keyword ?? '',
        introduction: formData.introduction ?? '',
        description: formData.description ?? '',
        metaTitle: formData.metaTitle ?? '',
        metaDescription: formData.metaDescription ?? '',
      }"
      :initial-data="i18nData"
      :save-api="saveSpuI18n"
    />
  </div>
</template>
<style lang="scss" scoped>
:deep(.ant-tabs-tab-btn) {
  font-size: 14px !important;
}
</style>
