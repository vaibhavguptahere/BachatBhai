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
    <div className='mt-20 space-y-8 px-5 gap-4 items-end justify-between'>
      {/* Main Account Show Section */}
      <div className="">
        <h1>{account.name}</h1>
        <p>{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
      </div >

      <div className="">
        <div className="">Rs {parseFloat(account.balance).toFixed(2)}</div>
        <p>{account._count.transactions} Transactions</p>
      </div>

      {/* Chart Section */}

      {/* Transaction Table */}

    </div>
  )
}

export default AccountsPage
