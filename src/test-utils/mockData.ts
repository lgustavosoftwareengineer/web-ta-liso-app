/**
 * Mock data factories for BDD-style tests.
 * Aligns with API schemas (CategoryResponse, TransactionResponse).
 */
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'

export function createCategory(overrides: Partial<CategoryResponse> = {}): CategoryResponse {
  return {
    id: 'cat-1',
    name: 'Alimentação',
    icon: '🛒',
    initial_amount: '1000',
    current_balance: '800',
    reset_month: null,
    reset_year: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

export function createTransaction(overrides: Partial<TransactionResponse> = {}): TransactionResponse {
  return {
    id: 'txn-1',
    category_id: 'cat-1',
    description: 'Mercado',
    amount: '200',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/** Transaction created_at in a specific month (year, month 0-11). */
export function transactionInMonth(year: number, month: number, day = 15): string {
  return new Date(year, month, day).toISOString()
}
