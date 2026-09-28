// ==============================================================================
// 3LINE GADGETS — CONFIGURED TEST BANK ACCOUNTS FOR MANUAL BANK TRANSFERS
// lib/config/bank-accounts.ts
// Configured accounts with genuine Nigerian banking formats. Never invent random dummy banks.
// ==============================================================================

export interface BankAccountDetails {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
  notes?: string;
  logoColor?: string;
}

export const CONFIGURED_BANK_ACCOUNTS: BankAccountDetails[] = [
  {
    id: 'kuda-bank',
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '2019482015',
    accountName: '3Line Gadgets Ltd',
    notes: 'Zero transfer fee on Kuda app. Instant settlement.',
    logoColor: 'bg-purple-700 text-white',
  },
  {
    id: 'gtbank',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0149285012',
    accountName: '3Line Gadgets Retail Ltd',
    notes: 'Supports GTWorld, 737 USSD, and interbank instant transfers.',
    logoColor: 'bg-amber-600 text-white',
  },
  {
    id: 'zenith-bank',
    bankName: 'Zenith Bank Plc',
    accountNumber: '1014892019',
    accountName: '3Line Gadgets Operations',
    notes: 'Verify recipient name displays 3Line Gadgets Operations before PIN.',
    logoColor: 'bg-rose-700 text-white',
  },
  {
    id: 'access-bank',
    bankName: 'Access Bank Plc',
    accountNumber: '0823491028',
    accountName: '3Line Gadgets Ltd',
    notes: 'Instant NIBSS settlement with nationwide interbank transfers.',
    logoColor: 'bg-orange-600 text-white',
  },
];

/**
 * Returns a randomly selected bank account from the configured test accounts list.
 */
export function getRandomBankAccount(): BankAccountDetails {
  const index = Math.floor(Math.random() * CONFIGURED_BANK_ACCOUNTS.length);
  return CONFIGURED_BANK_ACCOUNTS[index];
}

/**
 * Find a bank account by its ID
 */
export function getBankAccountById(id: string): BankAccountDetails {
  return (
    CONFIGURED_BANK_ACCOUNTS.find((acc) => acc.id === id) ||
    CONFIGURED_BANK_ACCOUNTS[0]
  );
}
