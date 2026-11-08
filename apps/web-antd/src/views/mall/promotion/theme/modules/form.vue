<script lang="ts" setup>
import type {MallCategoryApi} from '#/api/mall/product/category';
import type {MallLanguageApi} from '#/api/mall/product/language';
import type {MallSpuApi} from '#/api/mall/product/spu';
import type {ThemeCustomization, ThemeCustomizationTranslation} from '#/api/mall/promotion/theme';
import {
  THEME_CUSTOMIZATION_TYPE,
  type ThemeCustomizationType,
} from '#/api/mall/promotion/theme';

import {computed, onMounted, ref, watch} from 'vue';

import {handleTree} from '@vben/utils';
import {useVbenModal} from '@vben/common-ui';

import {message, Modal as AntModal, TreeSelect} from 'ant-design-vue';

import {useVbenForm} from '#/adapter/form';
import {
  createThemeCustomization,
  getThemeCustomization,
  updateThemeCustomization,
} from '#/api/mall/promotion/theme';
import {getCategoryList} from '#/api/mall/product/category';
import {getLanguageList} from '#/api/mall/product/language';
import ProductCategorySelect from '#/views/mall/product/category/components/select.vue';
import {getSpuDetailList, getSpuPage} from '#/api/mall/product/spu';
import {$t} from '#/locales';

import {useFormSchema} from '../data';

const emit = defineEmits(['success']);

/** 当前选中的 type */
const currentType = ref<ThemeCustomizationType | ''>('');

/** product_carousel 配置 */
const productConfig = ref({
  layout: 'featured3' as 'featured3' | 'grid4' | 'grid8',
  productIds: [] as number[],
  sortField: 'createTime' as 'salesCount' | 'createTime' | 'price',
  sortAsc: false,
});

/** 已选商品的 SPU 详情 */
const selectedSpus = ref<MallSpuApi.Spu[]>([]);

/** category_carousel 配置 */
const categoryConfig = ref<{categoryIds: number[]}>({categoryIds: []});

/** 从分类树里递归找 id 对应的完整 Category（含 picUrl） */
function findCategoryById(
  tree: MallCategoryApi.Category[],
  id: number,
): MallCategoryApi.Category | undefined {
  for (const node of tree as any[]) {
    if (node.id === id) return node as MallCategoryApi.Category;
    if (node.children?.length) {
      const found = findCategoryById(node.children as MallCategoryApi.Category[], id);
      if (found) return found;
    }
  }
  return undefined;
}

/** 已选分类的完整对象列表（含 picUrl，用于缩略图展示） */
const selectedCategories = computed<MallCategoryApi.Category[]>(() => {
  if (!categoryConfig.value.categoryIds.length) return [];
  return categoryConfig.value.categoryIds.map((id) => {
    return findCategoryById(spuCategoryTree.value, id) ?? ({id, name: `ID #${id}`} as MallCategoryApi.Category);
  });
});

/** 从已选分类里移除一个 */
function removeSelectedCategory(id: number) {
  const ids = categoryConfig.value.categoryIds;
  const idx = ids.indexOf(id);
  if (idx >= 0) {
    ids.splice(idx, 1);
    categoryConfig.value = {...categoryConfig.value};
  }
}

/** translations */
const translations = ref<ThemeCustomizationTranslation[]>([]);

/** 后台统一配置的启用语言列表（替代手填 locale） */
const languageList = ref<MallLanguageApi.Language[]>([]);
/** 默认语言 code —— 后端兜底用，Admin 不需要单独配翻译行 */
const defaultLanguageCode = computed(() =>
  languageList.value.find((l) => l.isDefault)?.code ?? null,
);
const languageOptions = computed(() =>
  languageList.value
    .filter((l) => l.status === 1)
    .map((l) => ({
      label: `${l.flag ? `${l.flag} ` : ""}${l.name} (${l.code})${
        l.isDefault ? $t('common.promotion.themeCustomization.translation.defaultSuffix') : ""
      }`,
      value: l.code,
      /** 给"添加翻译"按钮过滤用（默认语言不需要配置） */
      isDefault: l.isDefault,
    })),
);

/** translations 里已经被选过的 locale code 集合 */
const usedLocaleCodes = computed(() =>
  new Set(translations.value.map((t) => t.locale).filter((l): l is string => Boolean(l))),
);

/**
 * 还可以添加的语言（排除 translations 里已选的）。
 * 注意：默认语言**也必须**配翻译行（主表 config 里没有 title/subtitle，
 * 所有标题副标题都存在翻译表里），所以默认语言不做特殊排除。
 */
const availableLanguageOptions = computed(() => {
  const blocked = usedLocaleCodes.value;
  return languageOptions.value.filter((opt) => !blocked.has(opt.value));
});

/**
 * 给 a-table 某一行的 locale 下拉用的 options：
 * 只排除"其他行"已选的 code（当前行自己的 code 保留，避免编辑时把自己屏蔽掉）。
 * 所有启用语言（含默认语言）都允许选。
 */
function getLocaleOptionsForRow(rowIndex: number) {
  const rowOwnLocale = translations.value[rowIndex]?.locale;
  const others = translations.value
    .filter((_, i) => i !== rowIndex)
    .map((t) => t.locale)
    .filter(Boolean);
  const blocked = new Set(others);
  return languageOptions.value.filter((opt) => {
    // 其他行占了 → 只有自己行才能保留
    if (blocked.has(opt.value)) return opt.value === rowOwnLocale;
    return true;
  });
}

/** 校验 translations 里 locale 是否有重复 */
function validateTranslationsLocale(): boolean {
  const seen = new Set<string>();
  for (const t of translations.value) {
    const loc = t.locale;
    if (!loc) continue;
    if (seen.has(loc)) {
      const idx = translations.value.indexOf(t) + 1;
      message.error(
        $t('common.promotion.themeCustomization.translation.localeDuplicate', {
          row: idx,
          locale: loc,
        }),
      );
      return false;
    }
    seen.add(loc);
  }
  return true;
}

/** 选择语言后自动添加一条翻译（"添加翻译"按钮用） */
function addTranslationWithLocale(locale: string) {
  translations.value.push({
    id: 0,
    customizationId: 0,
    locale,
    title: '',
    subtitle: '',
  });
}

/** 每种 layout 要求的商品数量（与后端 ThemeConfigSchema 对齐） */
const LAYOUT_LIMIT: Record<string, number> = {
  featured3: 3,
  grid4: 4,
  grid8: 8,
};

watch(
  () => productConfig.value.layout,
  (layout) => {
    const limit = LAYOUT_LIMIT[layout] ?? 4;
    if (productConfig.value.productIds.length > limit) {
      productConfig.value.productIds = productConfig.value.productIds.slice(0, limit);
      selectedSpus.value = selectedSpus.value.slice(0, limit);
      message.info(
        $t('common.promotion.themeCustomization.product.truncated', {
          layout,
          limit,
        }),
      );
    }
  },
);

// =========================================================
// SPU 商品选择弹窗
// =========================================================

const spuModalOpen = ref(false);
const spuModalLoading = ref(false);
const spuLoading = ref(false);
const spuPage = ref(1);
const spuPageSize = ref(10);
const spuTotal = ref(0);
const spuSearchName = ref('');
const spuSearchCategoryId = ref<number | undefined>(undefined);
const spuList = ref<MallSpuApi.Spu[]>([]);

/** 分类树 */
const spuCategoryTree = ref<MallCategoryApi.Category[]>([]);
onMounted(async () => {
  try {
    const data = await getCategoryList({});
    spuCategoryTree.value = handleTree(data, 'id', 'parentId') as MallCategoryApi.Category[];
  } catch {
    // 静默
  }
  try {
    languageList.value = await getLanguageList();
  } catch {
    // 静默，翻译区下拉会为空
  }
});

/** 弹窗里当前勾选的 SPU IDs —— 使用 Set 做全局跨页选择容器 */
const spuModalSelectedIds = ref<Set<number>>(new Set());

/** 跨页浏览时缓存 SPU 详情（id → Spu），保证弹窗底部显示已选商品有名字和封面 */
const spuIdCache = ref<Map<number, MallSpuApi.Spu>>(new Map());

async function loadSpuList() {
  spuLoading.value = true;
  try {
    const res = await getSpuPage({
      pageNo: spuPage.value,
      pageSize: spuPageSize.value,
      name: spuSearchName.value || undefined,
      categoryId: spuSearchCategoryId.value,
      tabType: 0,
    });
    spuList.value = res.list ?? [];
    spuTotal.value = res.total ?? 0;
    // 当前页 SPU 塞入缓存，跨页选择时弹窗底部能显示名字/封面
    for (const spu of spuList.value) {
      if (spu.id != null) spuIdCache.value.set(spu.id, spu);
    }
  } finally {
    spuLoading.value = false;
  }
}

function openSpuModal() {
  // Set 容器从已配置的 productIds 初始化（编辑时自动回填）
  spuModalSelectedIds.value = new Set([...productConfig.value.productIds]);
  spuIdCache.value = new Map(); // 每次打开重新缓存，避免过期

  spuSearchName.value = '';
  spuSearchCategoryId.value = undefined;
  spuPage.value = 1;
  spuModalOpen.value = true;
  loadSpuList();

  // 编辑回填：预加载已选商品详情进 spuIdCache，弹窗底部立刻能显示名字/封面
  if (productConfig.value.productIds.length > 0) {
    getSpuDetailList(productConfig.value.productIds)
      .then((details) => {
        for (const spu of details) {
          if (spu.id != null) spuIdCache.value.set(spu.id, spu);
        }
      })
      .catch(() => {
        // 静默，弹窗底部会 fallback 显示 ID
      });
  }
}

function closeSpuModal() {
  spuModalOpen.value = false;
}

async function confirmSpuModal() {
  const limit = LAYOUT_LIMIT[productConfig.value.layout] ?? 4;
  const ids = [...spuModalSelectedIds.value];
  if (ids.length > limit) {
    message.warning(
      $t('common.promotion.themeCustomization.product.requiredN', {
        limit,
        count: ids.length,
      }),
    );
    return;
  }
  if (ids.length === 0) {
    message.warning($t('common.promotion.themeCustomization.product.minOneRequired'));
    return;
  }

  spuModalLoading.value = true;
  try {
    productConfig.value.productIds = ids;
    const details = await getSpuDetailList(ids);
    selectedSpus.value = ids
      .map((id) => details.find((s) => s.id === id))
      .filter(Boolean) as MallSpuApi.Spu[];
    spuModalOpen.value = false;
    message.success(
      $t('common.promotion.themeCustomization.product.selectedN', { count: ids.length }),
    );
  } finally {
    spuModalLoading.value = false;
  }
}

function removeSelectedSpu(id: number) {
  const idx = productConfig.value.productIds.indexOf(id);
  if (idx >= 0) {
    productConfig.value.productIds.splice(idx, 1);
    selectedSpus.value.splice(idx, 1);
  }
}

// =========================================================
// 跨页选择：增量更新全局 Set（不能用 onChange 全量覆盖）
// =========================================================

/** 表格勾选单行 — 对 Set 做精准 add/delete */
function handleSpuSelect(record: MallSpuApi.Spu, selected: boolean) {
  if (record.id == null) return;
  if (selected) {
    spuModalSelectedIds.value.add(record.id);
    spuIdCache.value.set(record.id, record);
  } else {
    spuModalSelectedIds.value.delete(record.id);
  }
  // Set 的 add/delete 不触发 ref 响应式，手动重建一个新 Set 触发更新
  spuModalSelectedIds.value = new Set(spuModalSelectedIds.value);
}

/** 表格勾选"全选/取消全选当前页" — 只对当前页变化的行做增量更新 */
function handleSpuSelectAll(
  selected: boolean,
  _selectedRows: MallSpuApi.Spu[],
  changeRows: MallSpuApi.Spu[],
) {
  changeRows.forEach((row) => {
    if (row.id == null) return;
    if (selected) {
      spuModalSelectedIds.value.add(row.id);
      spuIdCache.value.set(row.id, row);
    } else {
      spuModalSelectedIds.value.delete(row.id);
    }
  });
  spuModalSelectedIds.value = new Set(spuModalSelectedIds.value);
}

/** 给 a-table selectedRowKeys 用的响应式数组（从 Set 转） */
const spuModalSelectedKeyArray = computed(() => [...spuModalSelectedIds.value]);

/** 弹窗底部"已选商品缩略列表"的数据源 */
const spuModalSelectedDisplay = computed<MallSpuApi.Spu[]>(() => {
  return [...spuModalSelectedIds.value].map((id) => {
    const cached = spuIdCache.value.get(id);
    return cached ?? ({id, name: `ID #${id}`} as MallSpuApi.Spu);
  });
});

/** 弹窗底部：从 Set 直接移除一个已选商品（无需翻回当前页） */
function removeFromSpuModal(id: number) {
  spuModalSelectedIds.value.delete(id);
  spuModalSelectedIds.value = new Set(spuModalSelectedIds.value);
}

// =========================================================
// assembleConfig + Modal/Form
// =========================================================

function assembleConfig(): Record<string, unknown> {
  if (currentType.value === THEME_CUSTOMIZATION_TYPE.PRODUCT_CAROUSEL) {
    const ids = productConfig.value.productIds;
    const limit = LAYOUT_LIMIT[productConfig.value.layout] ?? 4;
    if (ids.length !== limit) {
      throw new Error(
        $t('common.promotion.themeCustomization.product.requiredN', {
          limit,
          count: ids.length,
        }),
      );
    }
    return {
      layout: productConfig.value.layout,
      productIds: ids,
      sortField: productConfig.value.sortField,
      sortAsc: productConfig.value.sortAsc,
    };
  }
  if (currentType.value === THEME_CUSTOMIZATION_TYPE.CATEGORY_CAROUSEL) {
    const ids = categoryConfig.value.categoryIds;
    if (ids.length === 0) {
      throw new Error(
        $t('common.promotion.themeCustomization.category.minOneRequired'),
      );
    }
    return {categoryIds: ids};
  }
  return {};
}

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('common.promotion.themeCustomization.sectionName')])
    : $t('ui.actionTitle.create', [$t('common.promotion.themeCustomization.sectionName')]);
});

const formData = ref<ThemeCustomization>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const {valid} = await formApi.validate();
    if (!valid) return;
    if (!validateTranslationsLocale()) {
      modalApi.unlock();
      return;
    }
    modalApi.lock();
    try {
      const raw = (await formApi.getValues()) as Record<string, unknown>;
      currentType.value = (raw.type as ThemeCustomizationType) || '';

      let config: Record<string, unknown>;
      try {
        config = assembleConfig();
      } catch (err: any) {
        message.error(
          err?.message ||
            $t('common.promotion.themeCustomization.config.validationFailed'),
        );
        modalApi.unlock();
        return;
      }

      const payload: Omit<ThemeCustomization, 'id' | 'createTime'> = {
        pageCode: (raw.pageCode as string) || 'home',
        themeCode: (raw.themeCode as string) || 'default',
        type: currentType.value as ThemeCustomizationType,
        name: raw.name as string,
        sort: Number(raw.sort) || 0,
        status: Number(raw.status) ?? 0,
        config,
        remark: raw.remark as string | undefined,
        translations: translations.value,
      };

      if (formData.value?.id) {
        await updateThemeCustomization({...payload, id: formData.value.id} as ThemeCustomization);
      } else {
        await createThemeCustomization(payload);
      }
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } catch (err) {
      message.error($t('common.saveFailed') + ': ' + (err as Error).message);
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetAllState();
      return;
    }
    const data = modalApi.getData<ThemeCustomization>();
    if (!data || !data.id) {
      resetAllState();
      await formApi.setValues({pageCode: 'home', themeCode: 'default', status: 0});
      return;
    }
    modalApi.lock();
    try {
      const detail = await getThemeCustomization(data.id);
      formData.value = detail;
      currentType.value = detail.type;
      translations.value = detail.translations ?? [];

      const cfg = (detail.config as Record<string, any>) ?? {};
      if (detail.type === THEME_CUSTOMIZATION_TYPE.PRODUCT_CAROUSEL) {
        const layout = (cfg.layout as 'featured3' | 'grid4' | 'grid8') || 'featured3';
        const ids = Array.isArray(cfg.productIds) ? (cfg.productIds as number[]) : [];
        productConfig.value = {
          layout,
          productIds: ids,
          sortField: (cfg.sortField as any) || 'createTime',
          sortAsc: Boolean(cfg.sortAsc),
        };
        if (ids.length > 0) {
          try {
            const details = await getSpuDetailList(ids);
            selectedSpus.value = ids
              .map((id) => details.find((s) => s.id === id))
              .filter(Boolean) as MallSpuApi.Spu[];
          } catch {
            selectedSpus.value = ids.map((id) => ({id, name: `ID #${id}`}) as MallSpuApi.Spu);
          }
        } else {
          selectedSpus.value = [];
        }
      } else if (detail.type === THEME_CUSTOMIZATION_TYPE.CATEGORY_CAROUSEL) {
        const ids = Array.isArray(cfg.categoryIds) ? (cfg.categoryIds as number[]) : [];
        categoryConfig.value = {categoryIds: [...ids]};
      }

      await formApi.setValues({...detail, config: undefined});
    } finally {
      modalApi.unlock();
    }
  },
});

function resetAllState() {
  formData.value = undefined;
  currentType.value = '';
  productConfig.value = {layout: 'featured3', productIds: [], sortField: 'createTime', sortAsc: false};
  selectedSpus.value = [];
  categoryConfig.value = {categoryIds: []};
  translations.value = [];
}
</script>

<template>
  <Modal :title="getTitle" class="w-3/5">
    <div class="px-4">
      <Form />

      <!-- ===== 可视化配置区 ===== -->
      <div class="mt-4 rounded-lg border border-gray-200 p-4">
        <h4 class="mb-3 text-sm font-semibold">{{ $t('common.promotion.themeCustomization.templateConfig.title') }}</h4>

        <div v-if="!currentType" class="text-sm text-gray-400">
          {{ $t('common.promotion.themeCustomization.templateConfig.pleaseSelectTypeFirst') }}
        </div>

        <!-- product_carousel -->
        <div v-else-if="currentType === THEME_CUSTOMIZATION_TYPE.PRODUCT_CAROUSEL">
          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label class="text-sm text-gray-500 block mb-1">{{ $t('common.promotion.themeCustomization.product.layout') }}</label>
              <a-select
                v-model:value="productConfig.layout"
                :options="[
                  {label: $t('common.promotion.themeCustomization.product.layoutFeatured3'), value: 'featured3'},
                  {label: $t('common.promotion.themeCustomization.product.layoutGrid4'), value: 'grid4'},
                  {label: $t('common.promotion.themeCustomization.product.layoutGrid8'), value: 'grid8'},
                ]"
              />
            </div>
            <div>
              <label class="text-sm text-gray-500 block mb-1">{{ $t('common.promotion.themeCustomization.product.sortField') }}</label>
              <a-select
                v-model:value="productConfig.sortField"
                :options="[
                  {label: $t('common.promotion.themeCustomization.product.sortSalesCount'), value: 'salesCount'},
                  {label: $t('common.promotion.themeCustomization.product.sortCreateTime'), value: 'createTime'},
                  {label: $t('common.promotion.themeCustomization.product.sortPrice'), value: 'price'},
                ]"
              />
            </div>
          </div>
          <div class="mb-3">
            <a-checkbox v-model:checked="productConfig.sortAsc" />
            <span class="ml-1 text-sm text-gray-600">{{ $t('common.promotion.themeCustomization.product.sortAsc') }}</span>
          </div>

          <!-- 已选商品卡片 -->
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ $t('common.promotion.themeCustomization.product.selectedItems', { count: productConfig.productIds.length, limit: LAYOUT_LIMIT[productConfig.layout] ?? 4 }) }}
            </span>
            <a-button size="small" type="primary" @click="openSpuModal">{{ $t('common.promotion.themeCustomization.product.selectItems') }}</a-button>
          </div>

          <div v-if="selectedSpus.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="(spu, i) in selectedSpus"
              :key="spu.id"
              class="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1"
            >
              <span class="text-xs text-gray-400">{{ i + 1 }}</span>
              <img
                v-if="spu.picUrl"
                :src="spu.picUrl"
                class="h-6 w-6 rounded object-cover"
                alt=""
              />
              <span class="max-w-[200px] truncate text-sm">{{ spu.name || `ID #${spu.id}` }}</span>
              <span class="text-xs text-gray-400">#{{ spu.id }}</span>
              <a-button size="small" type="text" danger @click="removeSelectedSpu(spu.id!)">×</a-button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">
            {{ $t('common.promotion.themeCustomization.product.noItemsSelected') }}
          </div>
        </div>

        <!-- category_carousel -->
        <div v-else-if="currentType === THEME_CUSTOMIZATION_TYPE.CATEGORY_CAROUSEL">
          <label class="text-sm text-gray-500 block mb-1">{{ $t('common.promotion.themeCustomization.category.label') }}</label>
          <ProductCategorySelect
            v-model="categoryConfig.categoryIds"
            :multiple="true"
          />

          <!-- 已选分类缩略图列表（含主图 + 名字 + × 移除） -->
          <div class="mt-3 flex flex-wrap gap-2">
            <div
              v-for="(cat, i) in selectedCategories"
              :key="cat.id"
              class="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1"
            >
              <span class="text-xs text-gray-400">{{ i + 1 }}</span>
              <img
                v-if="cat.picUrl"
                :src="cat.picUrl"
                class="h-6 w-6 rounded object-cover"
                alt=""
              />
              <span v-else class="h-6 w-6 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">{{ $t('common.noImage') }}</span>
              <span class="max-w-[180px] truncate text-sm">{{ cat.name }}</span>
              <span class="text-xs text-gray-400">#{{ cat.id }}</span>
              <a-button
                size="small"
                type="text"
                danger
                @click="removeSelectedCategory(cat.id!)"
              >×</a-button>
            </div>
            <div v-if="selectedCategories.length === 0" class="text-xs text-gray-400">
              {{ $t('common.promotion.themeCustomization.category.noItemsSelected') }}
            </div>
          </div>
        </div>

        <!-- static_content 占位 -->
        <div v-else class="text-sm text-gray-400">
          {{ $t('common.promotion.themeCustomization.staticContent.notAvailable') }}
        </div>
      </div>

      <!-- ===== 翻译管理 ===== -->
      <div class="mt-4">
        <div class="mb-2 flex items-center justify-between">
          <h4 class="text-sm font-semibold">{{ $t('common.promotion.themeCustomization.translation.title') }}</h4>
          <a-dropdown v-if="availableLanguageOptions.length > 0">
            <a-button size="small" type="dashed">
              {{ $t('common.promotion.themeCustomization.translation.addAvailable', { count: availableLanguageOptions.length }) }}
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-for="opt in availableLanguageOptions"
                  :key="opt.value"
                  @click="addTranslationWithLocale(opt.value)"
                >
                  {{ opt.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <span v-else class="text-xs text-gray-400">{{ $t('common.promotion.themeCustomization.translation.allAdded') }}</span>
        </div>
        <a-table
          :columns="[
            {title: 'Locale', dataIndex: 'locale', width: 180},
            {title: $t('common.promotion.themeCustomization.translation.colTitle'), dataIndex: 'title'},
            {title: $t('common.promotion.themeCustomization.translation.colSubtitle'), dataIndex: 'subtitle'},
            {title: $t('common.actions'), key: 'action', width: 80},
          ]"
          :data-source="translations"
          :pagination="false"
          :row-key="(row: ThemeCustomizationTranslation) => row.id || row.locale"
          size="small"
          bordered
        >
          <template #bodyCell="{column, record, index}">
            <template v-if="column.dataIndex === 'locale'">
              <a-select
                v-model:value="record.locale"
                :options="getLocaleOptionsForRow(index)"
                placeholder="{{ $t('common.promotion.themeCustomization.translation.selectLang') }}"
                allow-clear
                style="width: 100%"
              />
            </template>
            <template v-else-if="column.dataIndex === 'title'">
              <a-input v-model:value="record.title" placeholder="{{ $t('common.promotion.themeCustomization.translation.titlePlaceholder') }}" />
            </template>
            <template v-else-if="column.dataIndex === 'subtitle'">
              <a-input v-model:value="record.subtitle" placeholder="{{ $t('common.promotion.themeCustomization.translation.subtitlePlaceholder') }}" />
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button size="small" type="link" danger @click="translations.splice(index, 1)">
                {{ $t('common.delete') }}
              </a-button>
            </template>
          </template>
        </a-table>
        <div class="mt-1 text-xs text-gray-400">
          {{ $t('common.promotion.themeCustomization.translation.localeHint') }}
        </div>
      </div>
    </div>
  </Modal>

  <!-- ====== SPU 商品选择弹窗 ====== -->
  <AntModal
    v-model:open="spuModalOpen"
    title="{{ $t('common.promotion.themeCustomization.product.modalTitle') }}"
    width="70%"
    :confirm-loading="spuModalLoading"
    @ok="confirmSpuModal"
    @cancel="closeSpuModal"
  >
    <div class="mb-3 flex flex-wrap gap-3">
      <a-input
        v-model:value="spuSearchName"
        placeholder="{{ $t('common.promotion.themeCustomization.product.searchByName') }}"
        style="width: 200px"
        allow-clear
        @press-enter="() => { spuPage = 1; loadSpuList(); }"
      />
      <TreeSelect
        v-model:value="spuSearchCategoryId"
        :tree-data="spuCategoryTree"
        :field-names="{children: 'children', label: 'name', value: 'id'}"
        placeholder="{{ $t('common.promotion.themeCustomization.product.filterByCategory') }}"
        style="width: 200px"
        allow-clear
        tree-default-expand-all
        @change="() => { spuPage = 1; loadSpuList(); }"
      />
      <a-button type="primary" @click="() => { spuPage = 1; loadSpuList(); }">{{ $t('common.search') }}</a-button>
    </div>

    <a-table
      :columns="[
        {title: 'ID', dataIndex: 'id', width: 80},
        {title: $t('common.promotion.themeCustomization.product.colCover'), dataIndex: 'picUrl', width: 80},
        {title: $t('common.promotion.themeCustomization.product.colName'), dataIndex: 'name'},
        {title: $t('common.promotion.themeCustomization.product.colSalesCount'), dataIndex: 'salesCount', width: 80},
      ]"
      :data-source="spuList"
      :loading="spuLoading"
      :pagination="{
        current: spuPage,
        pageSize: spuPageSize,
        total: spuTotal,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => $t('common.totalItems', { total }),
        onChange: (page: number, pageSize: number) => {
          spuPage = page;
          spuPageSize = pageSize;
          loadSpuList();
        },
      }"
      :row-selection="{
        selectedRowKeys: spuModalSelectedKeyArray,
        preserveSelectedRowKeys: true,
        onSelect: handleSpuSelect,
        onSelectAll: handleSpuSelectAll,
      }"
      row-key="id"
      size="small"
      bordered
    >
      <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex === 'picUrl'">
          <img
            v-if="record.picUrl"
            :src="record.picUrl"
            class="h-10 w-10 rounded object-cover"
            alt=""
          />
        </template>
      </template>
    </a-table>

    <!-- ===== 弹窗底部：跨页累积的已选商品列表（可直接 × 移除） ===== -->
    <div class="mt-3 rounded border border-gray-200 bg-gray-50 p-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm text-gray-500" v-html="$t('common.promotion.themeCustomization.product.modalSelectedCount', { selected: spuModalSelectedIds.size, limit: LAYOUT_LIMIT[productConfig.layout] ?? 4 })"></span>
        <a-button
          v-if="spuModalSelectedIds.size > 0"
          size="small"
          type="link"
          danger
          @click="spuModalSelectedIds = new Set(); spuIdCache = new Map()"
        >
          {{ $t('common.promotion.themeCustomization.product.modalClearAll') }}
        </a-button>
      </div>

      <div v-if="spuModalSelectedDisplay.length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="(spu, i) in spuModalSelectedDisplay"
          :key="spu.id"
          class="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs"
        >
          <span class="text-gray-400">{{ i + 1 }}</span>
          <img
            v-if="spu.picUrl"
            :src="spu.picUrl"
            class="h-5 w-5 rounded object-cover"
            alt=""
          />
          <span class="max-w-[160px] truncate text-gray-700">{{ spu.name }}</span>
          <span class="text-gray-300">#{{ spu.id }}</span>
          <a-button size="small" type="text" danger @click="removeFromSpuModal(spu.id!)">×</a-button>
        </div>
      </div>

      <div v-else class="text-xs text-gray-400">
        {{ $t('common.promotion.themeCustomization.product.modalNoSelection') }}
      </div>
    </div>
  </AntModal>
</template>
