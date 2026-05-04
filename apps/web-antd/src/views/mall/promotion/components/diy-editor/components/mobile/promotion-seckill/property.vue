<script setup lang="ts">
import type { PromotionSeckillProperty } from './config';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import {
  Card,
  Checkbox,
  Form,
  FormItem,
  Input,
  RadioButton,
  RadioGroup,
  Slider,
  Switch,
  Tooltip,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { $t } from '#/locales';
import { ColorInput } from '#/views/mall/promotion/components';
import { SeckillShowcase } from '#/views/mall/promotion/seckill/components';

import ComponentContainerProperty from '../../component-container-property.vue';

/** 秒杀属性面板 */
defineOptions({ name: 'PromotionSeckillProperty' });

const props = defineProps<{ modelValue: PromotionSeckillProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);
</script>

<template>
  <ComponentContainerProperty v-model="formData.style">
    <Form
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <Card
        :title="$t('promotion.seckill.activity.title')"
        class="property-group"
      >
        <SeckillShowcase v-model="formData.activityIds" />
      </Card>
      <Card
        :title="$t('promotion.diy.editor.style.productStyle')"
        class="property-group"
      >
        <FormItem :label="$t('promotion.diy.editor.style.layout')" name="type">
          <RadioGroup v-model:value="formData.layoutType">
            <Tooltip
              :title="$t('promotion.diy.editor.style.layout.oneColBigImg')"
              placement="bottom"
            >
              <RadioButton value="oneColBigImg">
                <IconifyIcon
                  icon="fluent:text-column-one-24-filled"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip
              :title="$t('promotion.diy.editor.style.layout.oneColSmallImg')"
              placement="bottom"
            >
              <RadioButton value="oneColSmallImg">
                <IconifyIcon
                  icon="fluent:text-column-two-left-24-filled"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip
              :title="$t('promotion.diy.editor.style.layout.twoCol')"
              placement="bottom"
            >
              <RadioButton value="twoCol">
                <IconifyIcon
                  icon="fluent:text-column-two-24-filled"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.productName')"
          name="fields.name.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.name.color" />
            <Checkbox v-model:checked="formData.fields.name.show" />
          </div>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.productIntroduction')"
          name="fields.introduction.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.introduction.color" />
            <Checkbox v-model:checked="formData.fields.introduction.show" />
          </div>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.productPrice')"
          name="fields.price.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.price.color" />
            <Checkbox v-model:checked="formData.fields.price.show" />
          </div>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.marketPrice')"
          name="fields.marketPrice.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.marketPrice.color" />
            <Checkbox v-model:checked="formData.fields.marketPrice.show" />
          </div>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.productSales')"
          name="fields.salesCount.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.salesCount.color" />
            <Checkbox v-model:checked="formData.fields.salesCount.show" />
          </div>
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.productStock')"
          name="fields.stock.show"
        >
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.stock.color" />
            <Checkbox v-model:checked="formData.fields.stock.show" />
          </div>
        </FormItem>
      </Card>
      <Card
        :title="$t('promotion.diy.editor.style.badge')"
        class="property-group"
      >
        <FormItem
          :label="$t('promotion.diy.editor.style.badge')"
          name="badge.show"
        >
          <Switch v-model:checked="formData.badge.show" />
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.badge')"
          name="badge.imgUrl"
          v-if="formData.badge.show"
        >
          <UploadImg
            v-model="formData.badge.imgUrl"
            height="44px"
            width="72px"
            :show-description="false"
          >
            <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
            <template #tip>{{ $t('promotion.diy.editor.style.badgeSizeTip') }}</template>
          </UploadImg>
        </FormItem>
      </Card>
      <Card
        :title="$t('promotion.diy.editor.style.button')"
        class="property-group"
      >
        <FormItem
          :label="$t('promotion.diy.editor.style.buttonType')"
          name="btnBuy.type"
        >
          <RadioGroup v-model:value="formData.btnBuy.type">
            <RadioButton value="text">
              {{ $t('promotion.diy.editor.style.text') }}
            </RadioButton>
            <RadioButton value="img">
              {{ $t('promotion.diy.editor.style.image') }}
            </RadioButton>
          </RadioGroup>
        </FormItem>
        <template v-if="formData.btnBuy.type === 'text'">
          <FormItem
            :label="$t('promotion.diy.editor.style.buttonText')"
            name="btnBuy.text"
          >
            <Input v-model:value="formData.btnBuy.text" />
          </FormItem>
          <FormItem
            :label="$t('promotion.diy.editor.style.leftBg')"
            name="btnBuy.bgBeginColor"
          >
            <ColorInput v-model="formData.btnBuy.bgBeginColor" />
          </FormItem>
          <FormItem
            :label="$t('promotion.diy.editor.style.rightBg')"
            name="btnBuy.bgEndColor"
          >
            <ColorInput v-model="formData.btnBuy.bgEndColor" />
          </FormItem>
        </template>
        <template v-else>
          <FormItem
            :label="$t('promotion.diy.editor.style.image')"
            name="btnBuy.imgUrl"
          >
            <UploadImg
              v-model="formData.btnBuy.imgUrl"
              height="56px"
              width="56px"
              :show-description="false"
            >
              <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
              <template #tip>{{ $t('promotion.diy.editor.style.buttonSizeTip') }}</template>
            </UploadImg>
          </FormItem>
        </template>
      </Card>
      <Card
        :title="$t('promotion.diy.editor.style.productStyle')"
        class="property-group"
      >
        <FormItem
          :label="$t('promotion.diy.editor.style.borderRadiusTop')"
          name="borderRadiusTop"
        >
          <Slider
            v-model:value="formData.borderRadiusTop"
            :max="100"
            :min="0"
          />
        </FormItem>
        <FormItem
          :label="$t('promotion.diy.editor.style.borderRadiusBottom')"
          name="borderRadiusBottom"
        >
          <Slider
            v-model:value="formData.borderRadiusBottom"
            :max="100"
            :min="0"
          />
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.space')" name="space">
          <Slider v-model:value="formData.space" :max="100" :min="0" />
        </FormItem>
      </Card>
    </Form>
  </ComponentContainerProperty>
</template>
