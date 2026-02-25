import { ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  useListCategoriesApiCategoriesGet,
  useCreateCategoryApiCategoriesPost,
  useDeleteCategoryApiCategoriesCategoryIdDelete,
  getListCategoriesApiCategoriesGetQueryKey,
} from '@/api/generated/categories/categories'
import { useApiError } from '@/composables/useApiError'

const ICON_OPTIONS = ['🛒', '🚌', '🏥', '🎉', '📚', '✈️', '🏠', '🌵'] as const

export function useCategoriesManagement() {
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()

  const categoryName = ref('')
  const categoryBudget = ref('')
  const selectedIcon = ref<string>(ICON_OPTIONS[0])
  const createError = ref('')

  const { data: categories, isLoading } = useListCategoriesApiCategoriesGet()

  const createCategory = useCreateCategoryApiCategoriesPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
        categoryName.value = ''
        categoryBudget.value = ''
        selectedIcon.value = ICON_OPTIONS[0]
        createError.value = ''
      },
      onError: (e) => {
        createError.value = getErrorMessage(e)
      },
    },
  })

  const deleteCategory = useDeleteCategoryApiCategoriesCategoryIdDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
      },
    },
  })

  function saveCategory() {
    if (!categoryName.value.trim() || !categoryBudget.value) return
    createCategory.mutate({
      data: {
        name: categoryName.value.trim(),
        icon: selectedIcon.value,
        initial_amount: parseFloat(categoryBudget.value),
      },
    })
  }

  function deleteCategoryById(categoryId: string) {
    deleteCategory.mutate({ categoryId })
  }

  return {
    categories,
    isLoading,
    categoryName,
    categoryBudget,
    selectedIcon,
    iconOptions: ICON_OPTIONS,
    createError,
    createCategory,
    deleteCategory,
    saveCategory,
    deleteCategoryById,
  }
}
