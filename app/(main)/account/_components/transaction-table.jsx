"use client"

import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { categoryColors } from '@/data/categories'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

const TransactionTable = ({ transactions }) => {
    const filteredAndSortedTransactions = transactions ?? [];

    const handleSort = () => {
        // sorting logic here
    };


    return (
        <div>
            {/* Search Filters */}

            {/* Transactions */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                            <div className='flex items-center'>
                                Date
                            </div>
                        </TableHead>
                        <TableHead>
                            Description
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                            <div className='flex items-center'>
                                Category
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                            <div className='flex items-center justify-end'>
                                Amount
                            </div>
                        </TableHead>
                        <TableHead>
                            Recurring
                        </TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedTransactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredAndSortedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium">{format(new Date(transaction.date), "PP")}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className='capitalize'>
                                    <span style={{
                                        background: categoryColors[transaction.category],
                                    }} className='px-2 py-1 rounded text-white text-sm'>{transaction.category}</span></TableCell>

                                <TableCell className="text-right font-medium" style={{
                                    color: transaction.type === "EXPENSE" ? 'red' : 'green'
                                }}>{
                                        transaction.type === "EXPENSE" ? '- ' : '+ '
                                    }
                                    Rs. {transaction.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    {transaction.isRecurring ? (
                                        <Tooltip>
                                            <TooltipTrigger>Hover</TooltipTrigger>
                                            <TooltipContent>
                                                <p>Add to library</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Badge variant='outline gap-1'><Clock className='w-3 h-3'/>One-time</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Total</TableCell>
                        <TableCell className="text-right">Rs 2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default TransactionTable