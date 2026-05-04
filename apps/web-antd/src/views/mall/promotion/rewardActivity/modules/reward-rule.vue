<script lang="ts" setup>
import type { MallRewardActivityApi } from '#/api/mall/promotion/reward/rewardActivity';

import { computed } from 'vue';

import { PromotionConditionTypeEnum } from '@vben/constants';

import { useVModel } from '@vueuse/core';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Switch,
  Tag,
} from 'ant-design-vue';

import RewardRuleCouponSelect from './reward-rule-coupon-select.vue';

defineOptions({ name: 'RewardRule' });

const props = defineProps<{
  modelValue: Partial<MallRewardActivityApi.RewardActivity>;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', v: any): void;
}>();

const formData = useVModel(props, 'modelValue', emits);

const isPriceCondition = computed(() => {
  return (
    formData.value?.conditionType === PromotionConditionTypeEnum.PRICE.type
  );
});

/** 处理新增 */
function handleAdd() {
  if (!formData.value.rules) {
    formData.value.rules = [];
  }
  formData.value.rules.push({
    limit: 0,
    discountPrice: 0,
    freeDelivery: false,
    point: 0,
  });
}

/** 处理删除 */
function handleDelete(ruleIndex: number) {
  formData.value.rules?.splice(ruleIndex, 1);
}
</script>

<template>
  <Row :gutter="[16, 16]">
    <template v-if="formData.rules">
      <Col v-for="(rule, index) in formData.rules" :key="index" :span="24">
        <Card size="small" class="rounded-lg">
          <!-- 规则标题 -->
          <template #title>
            <div class="flex items-center">
              <span class="text-base font-medium">
                活动层级 {{ index + 1 }}
              </span>
            </div>
          </template>
          <template v-if="index !== 0" #extra>
            <Button
              type="link"
              danger
              size="small"
              @click="handleDelete(index)"
            >
              删除
            </Button>
          </template>

          <Form :model="rule" layout="horizontal">
            <!-- 优惠门槛 -->
            <FormItem label="优惠门槛:" :colon="false" class="mb-3">
              <div
                class="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2"
              >
                <span>满</span>
                <InputNumber
                  v-if="isPriceCondition"
                  v-model:value="rule.limit"
                  :min="0"
                  :precision="2"
                  :step="0.1"
                  class="!w-40"
                  :placeholder="$t('promotion.rewardActivity.form.placeholder.amount')"
                />
                <Input
                  v-else
                  v-model:value="rule.limit"
                  :min="0"
                  class="!w-40"
                  :placeholder="$t('promotion.rewardActivity.form.placeholder.quantity')"
                  type="number"
                />
                <span>{{ isPriceCondition ? $t('promotion.rewardActivity.form.unit.yuan') : $t('promotion.rewardActivity.form.unit.item') }}</span>
              </div>
            </FormItem>
            <!-- 优惠内容 -->
            <FormItem :label="$t('promotion.rewardActivity.form.discountContent')" :colon="false" class="!mb-0">
              <div class="flex flex-col gap-3">
                <!-- 订单金额优惠 -->
                <div
                  class="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2"
                >
                  <span class="!w-21 shrink-0 text-sm text-gray-500">
                    {{ $t('promotion.rewardActivity.form.discountPrice') }}
                  </span>
                  <span>{{ $t('promotion.rewardActivity.form.discountMinus') }}</span>
                  <InputNumber
                    v-model:value="rule.discountPrice"
                    :min="0"
                    :precision="2"
                    :step="0.1"
                    class="!w-32"
                    :placeholder="$t('promotion.rewardActivity.form.placeholder.amount')"
                  />
                  <span>{{ $t('promotion.rewardActivity.form.unit.yuan') }}</span>
                </div>
                <!-- 包邮 -->
                <div
                  class="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2"
                >
                  <span class="w-20 shrink-0 text-sm text-gray-500">{{ $t('promotion.rewardActivity.form.freeDelivery') }}</span>
                  <Switch
                    v-model:checked="rule.freeDelivery"
                    :checked-children="$t('promotion.rewardActivity.form.yes')"
                    :un-checked-children="$t('promotion.rewardActivity.form.no')"
                  />
                </div>
                <!-- 送积分 -->
                <div
                  class="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2"
                >
                  <span class="w-20 shrink-0 text-sm text-gray-500">
                    {{ $t('promotion.rewardActivity.form.sendPoint') }}
                  </span>
                  <span>{{ $t('promotion.rewardActivity.form.send') }}</span>
                  <InputNumber
                    v-model:value="rule.point"
                    :min="0"
                    class="!w-32"
                    :placeholder="$t('promotion.rewardActivity.form.placeholder.point')"
                  />
                  <span>{{ $t('promotion.rewardActivity.form.unit.point') }}</span>
                </div>
                <!-- 送优惠券 -->
                <div
                  class="flex flex-col items-start gap-2 rounded-md bg-gray-50 px-3 py-2"
                >
                  <span class="w-20 shrink-0 text-sm text-gray-500">
                    送优惠券
                  </span>
                  <RewardRuleCouponSelect
                    :model-value="rule"
                    @update:model-value="
                      (val) => (formData.rules![index] = val)
                    "
                  />
                </div>
              </div>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </template>

    <!-- 添加规则按钮 -->
    <Col :span="24" class="mt-2">
      <Button type="primary" @click="handleAdd">+ 添加优惠规则</Button>
    </Col>

    <!-- 提示信息 -->
    <Col :span="24" class="mt-2">
      <Tag color="warning">
        提示：赠送积分为 0 时不赠送；未选择优惠券时不赠送。
      </Tag>
    </Col>
  </Row>
</template>
