<script lang="ts" setup>
import type { MallLanguageApi } from '#/api/mall/product/language';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteLanguage,
  getLanguageList,
  setDefaultLanguage,
  updateLanguage,
  updateLanguageStatus,
} from '#/api/mall/product/language';
import QuickTranslateModal from '#/components/translate/QuickTranslateModal.vue';
import { $t } from '#/locales';
import Form from '#/views/mall/language/modules/form.vue';

import { useGridColumns } from './data';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [TranslateModal, translateModalApi] = useVbenModal({
  connectedComponent: QuickTranslateModal,
  destroyOnClose: true,
});

const currentTargetLanguage = ref<string>('');

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formModalApi.setData(null).open();
}

function handleEdit(row: MallLanguageApi.Language) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: MallLanguageApi.Language) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteLanguage(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

async function handleTranslate(row: MallLanguageApi.Language) {
  currentTargetLanguage.value = row.code;
  translateModalApi.open();
}

async function handleDefaultChange(
  newDefault: boolean,
  row: MallLanguageApi.Language,
): Promise<boolean | undefined> {
  if (isDefaultLanguage(row) === newDefault) {
    return true;
  }

  // ✅ 优化 1：使用 Number() 强制转换，规避 TS2367 string 和 number 的无交集比对警告
  if (newDefault && Number(row.status) === 0) {
    message.warning($t('language.mustEnableToSetDefault'));
    return false;
  }

  const actionText = newDefault
    ? $t('language.confirmSetDefault', [row.name])
    : $t('language.confirmCancelDefault', [row.name]);

  return new Promise((resolve) => {
    Modal.confirm({
      title: $t('ui.actionMessage.confirm'),
      content: actionText,
      onOk: async () => {
        const hideLoading = message.loading({
          content: $t('ui.actionMessage.updating', [row.name]),
          duration: 0,
        });
        try {
          if (newDefault) {
            await setDefaultLanguage(row.id!);
            message.success($t('language.setDefaultSuccess', [row.name]));
          } else {
            await updateLanguage({
              id: row.id,
              code: row.code,
              name: row.name,
              nativeName: row.nativeName,
              flag: row.flag,
              isDefault: false,
              // ✅ 优化 2：改用 ?? 运算符。防止原有的 status 为 0 时，被 || 误当成 false 而变回了 1
              status: row.status ?? 1,
              sort: row.sort,
            });
            message.success($t('language.cancelDefaultSuccess', [row.name]));
          }
          // ✅ 优化 3：重要！状态变动成功后必须重新刷新后端列表，保证多行之间“唯一默认”的排他性视图同步
          handleRefresh();
          resolve(true);
        } catch {
          resolve(false);
        } finally {
          hideLoading();
        }
      },
      onCancel: () => {
        resolve(false);
      },
    });
  });
}

async function handleStatusChange(
  newStatus: number,
  row: MallLanguageApi.Language,
): Promise<boolean | undefined> {
  if (isDefaultLanguage(row)) {
    message.warning($t('language.cannotDisableDefault'));
    return false;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.updating', [row.name]),
    duration: 0,
  });
  try {
    await updateLanguageStatus(row.id!, newStatus);
    message.success($t('ui.actionMessage.operationSuccess'));
    // ✅ 优化 4：状态修改成功后同步刷新表格数据
    handleRefresh();
    return true;
  } catch {
    return false;
  } finally {
    hideLoading();
  }
}

function isDefaultLanguage(row: MallLanguageApi.Language): boolean {
  // 优化 5：防御性类型转换，彻底断绝类似布尔与字符串比对的潜在编译警告
  return String(row.isDefault) === 'true';
}
// 1. 在调用函数时显式声明泛型 <MallLanguageApi.Language>
const [Grid, gridApi] = useVbenVxeGrid<MallLanguageApi.Language>({
  gridOptions: {
    // 2. 这里的 as 就不再需要了，或者安全地断言为 any 阻断过深推导
    columns: useGridColumns(handleStatusChange, handleDefaultChange) as any,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => {
          const list = await getLanguageList();
          return {
            list,
            page: { total: list.length, pageSize: 10, currentPage: 1 },
          };
        },
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: true },
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <TranslateModal
      :target-language="currentTargetLanguage"
      @success="handleRefresh"
    />
    <Grid :table-title="$t('language.list')">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', [$t('language.title')]),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['language:create'],
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
              auth: ['language:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('language.translate'),
              type: 'link',
              // icon: ACTION_ICON.TRANSLATE,
              auth: ['language:translate'],
              ifShow: row.status === 1 && !isDefaultLanguage(row),
              onClick: handleTranslate.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['language:delete'],
              ifShow: !isDefaultLanguage(row),
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
