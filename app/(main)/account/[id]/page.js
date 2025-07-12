import React from 'react'
import { getAccountWithTransactions } from '@/actions/account'
import { notFound } from 'next/navigation';
const AccountsPage = async ({ params }) => {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }
  const { transactions, ...account } = accountData;

  return (
    <div className='pt-28 space-y-8 px-5 gap-4 items-end justify-between flex'>
      {/* Main Account Show Section */}
      <div className="">
        <h1 className='text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize'>{account.name}</h1>
        <p className='text-muted-foreground'>
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div >

      <div className="text-right pb-2">
        <div className="text-xl sm:text-2xl font-bold">
          Rs {parseFloat(account.balance).toFixed(2)}
        </div>
        <p className='text-sm text-muted-foreground'>
          {account._count.transactions} Transactions
        </p>
      </div>

      {/* Chart Section */}

      {/* Transaction Table */}

    </div>
  )
}

export default AccountsPage
