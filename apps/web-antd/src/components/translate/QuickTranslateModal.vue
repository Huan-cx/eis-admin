<script lang="ts" setup>
import { onUnmounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Checkbox, message, Select } from 'ant-design-vue';

import {
  createTranslateTask,
  getTranslateProviders,
  getTranslateTaskStatus,
  getTranslateTypes,
} from '#/api/mall/product/translate';
import { $t } from '#/locales';

defineOptions({ name: 'QuickTranslateModal' });
const props = defineProps<{
  targetLanguage: string;
  translateType?: string;
  visible?: boolean;
}>();
const emit = defineEmits(['success', 'update:visible', 'close']);
interface ProviderOption {
  readonly value: string;
  readonly label: string;
}
interface TranslateTypeOption {
  readonly value: string;
  readonly label: string;
}
const [Modal, modalApi] = useVbenModal({
  title: $t('translate.quickTranslate'),
  closable: false,
  closeOnClickModal: false,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetState();
      return;
    }
    await loadOptions();
  },
});
const loading = ref(false);
const providerOptions = ref<ProviderOption[]>([]);
const translateTypeOptions = ref<TranslateTypeOption[]>([]);
const selectedProvider = ref<string>('');
const selectedTranslateType = ref<string>('ALL');
const overwrite = ref(false);
const pollingTaskId = ref<null | number>(null);
const pollingInterval = ref<null | ReturnType<typeof setInterval>>(null);
const taskStatus = ref<
  'failed' | 'not_found' | 'partial' | 'pending' | 'running' | 'success' | null
>(null);
const taskProgress = ref({ success: 0, skipped: 0, failed: 0, total: 0 });
const taskErrorMessage = ref('');
function resetState() {
  selectedProvider.value = '';
  selectedTranslateType.value = props.translateType || 'ALL';
  overwrite.value = false;
  taskStatus.value = null;
  taskProgress.value = { success: 0, skipped: 0, failed: 0, total: 0 };
  taskErrorMessage.value = '';
}
function firstOrEmpty<T>(arr: readonly T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}
function getProviderLabel(provider: string): string {
  switch (provider.toLowerCase()) {
    case 'alibaba': {
      return '阿里翻译';
    }
    case 'google': {
      return 'Google翻译';
    }
    case 'tencent': {
      return '腾讯翻译';
    }
    default: {
      return provider;
    }
  }
}
async function loadOptions() {
  loading.value = true;
  try {
    const [providerList, typeList] = await Promise.all([
      getTranslateProviders(),
      getTranslateTypes(),
    ]);
    providerOptions.value = providerList.map((p) => ({
      value: p,
      label: getProviderLabel(p),
    }));
    translateTypeOptions.value = typeList;
    const firstProvider = firstOrEmpty(providerOptions.value);
    selectedProvider.value = firstProvider?.value ?? '';
    if (!selectedTranslateType.value && typeList.length > 0) {
      selectedTranslateType.value = typeList[0]?.value ?? '';
    }
  } finally {
    loading.value = false;
  }
}
async function handleConfirm() {
  if (!selectedProvider.value) {
    message.error($t('translate.validation.selectProvider'));
    return;
  }
  loading.value = true;
  try {
    const reqData = {
      translateType: selectedTranslateType.value as any,
      targetLanguages: [props.targetLanguage],
      provider: selectedProvider.value as any,
      overwrite: overwrite.value,
      batchSize: 20,
      async: true,
    };
    const taskId = await createTranslateTask(reqData);
    pollingTaskId.value = taskId;
    taskStatus.value = 'pending';
    taskProgress.value = { success: 0, skipped: 0, failed: 0, total: 0 };
    loading.value = false;
    startPolling();
  } catch {
    message.error($t('translate.submitFailed'));
    loading.value = false;
  }
}

async function handleClose() {
  stopPolling();
  await modalApi.close();
  if (taskStatus.value === 'success' || taskStatus.value === 'partial') {
    emit('success');
  }
  emit('close');
}
async function startPolling() {
  pollingInterval.value = setInterval(async () => {
    const taskId = pollingTaskId.value;
    if (taskId === null) return;
    try {
      const task = await getTranslateTaskStatus(taskId);
      taskProgress.value = {
        success: task.translatedCount,
        skipped: task.skippedCount,
        failed: task.failedCount,
        total: task.totalCount,
      };
      taskErrorMessage.value = task.errorMessage || '';
      switch (task.status) {
        case 'COMPLETED': {
          taskStatus.value = task.failedCount > 0 ? 'partial' : 'success';
          stopPolling();
          break;
        }
        case 'FAILED': {
          taskStatus.value = 'failed';
          stopPolling();
          break;
        }
        case 'NOT_FOUND': {
          taskStatus.value = 'not_found';
          stopPolling();
          break;
        }
        case 'PENDING': {
          taskStatus.value = 'pending';
          break;
        }
        case 'RUNNING': {
          taskStatus.value = 'running';
          break;
        }
      }
    } catch (error) {
      console.error('轮询任务状态失败:', error);
    }
  }, 1000);
}
function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
  pollingTaskId.value = null;
}
onUnmounted(() => {
  stopPolling();
});
watch(
  () => props.visible,
  (isOpen) => {
    if (isOpen) {
      modalApi.open();
    } else {
      modalApi.close();
    }
  },
);
defineExpose({ modalApi });
</script>

<template>
  <Modal :footer="false">
    <div v-if="loading && pollingTaskId === null" class="py-10 text-center">
      <span class="loading-icon"></span>
      {{ $t('common.loading') }}
    </div>

    <div v-else-if="pollingTaskId !== null" class="py-10 text-center">
      <div class="mb-4">
        <svg
          v-if="taskStatus === 'pending' || taskStatus === 'running'"
          class="mx-auto h-12 w-12 animate-spin text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <svg
          v-else-if="taskStatus === 'success'"
          class="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="taskStatus === 'partial' || taskStatus === 'failed'"
          class="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div class="mb-2 text-lg font-medium">
        {{
          taskStatus === 'pending'
            ? $t('translate.statusPending')
            : taskStatus === 'running'
              ? $t('translate.statusRunning')
              : taskStatus === 'success'
                ? $t('translate.statusSuccess')
                : taskStatus === 'partial'
                  ? $t('translate.statusPartial')
                  : taskStatus === 'not_found'
                    ? $t('translate.statusNotFound')
                    : $t('translate.statusFailed')
        }}
      </div>
      <div class="space-y-1 text-sm text-gray-500">
        <div>
          {{
            $t('translate.progress', [
              taskProgress.success + taskProgress.skipped,
              taskProgress.total,
            ])
          }}
        </div>
        <div v-if="taskProgress.skipped > 0" class="text-yellow-500">
          {{ $t('translate.skipped', [taskProgress.skipped]) }}
        </div>
        <div v-if="taskProgress.failed > 0" class="text-red-500">
          {{ $t('translate.failed', [taskProgress.failed]) }}
        </div>
        <div v-if="taskErrorMessage" class="mt-2 text-red-500">
          {{ taskErrorMessage }}
        </div>
      </div>
      <div class="mx-auto mt-4 w-full max-w-xs">
        <div class="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full bg-blue-500 transition-all duration-300"
            :style="{
              width: `${(taskProgress.total > 0 ? (taskProgress.success + taskProgress.skipped) / taskProgress.total : 0) * 100}%`,
            }"
          ></div>
        </div>
      </div>
      <div
        v-if="
          taskStatus === 'success' ||
          taskStatus === 'partial' ||
          taskStatus === 'failed' ||
          taskStatus === 'not_found'
        "
        class="mt-6"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="handleClose"
        >
          {{ $t('common.close') }}
        </button>
      </div>
    </div>

    <template v-else>
      <div class="space-y-4">
        <div class="rounded-lg bg-blue-50 p-3">
          <div class="text-sm">
            {{ $t('translate.targetLanguage') }}:
            <span class="ml-2 font-medium">{{ targetLanguage }}</span>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            {{ $t('translate.translateType') }}
          </label>
          <Select
            v-model:value="selectedTranslateType"
            :options="translateTypeOptions"
            :placeholder="$t('translate.selectType')"
            class="w-full"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            {{ $t('translate.provider') }}
          </label>
          <Select
            v-model:value="selectedProvider"
            :options="providerOptions"
            :placeholder="$t('translate.selectProvider')"
            class="w-full"
          />
        </div>

        <div>
          <Checkbox v-model:checked="overwrite">
            {{ $t('translate.overwrite') }}
          </Checkbox>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="handleClose"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="!selectedProvider || loading"
            @click="handleConfirm"
          >
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
