"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { categoryColors } from '@/data/categories'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, MoveLeftIcon, MoveRightIcon, RefreshCw, Search, Trash, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/use-fetch'
import { bulkDeleteTransactions } from '@/actions/account'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly"
}
const TransactionTable = ({ transactions }) => {
    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc"
    })
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions)

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} transactions?`)) {
            return;
        }
        deleteFn(selectedIds);
    };

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
        }
    }, [deleted, deleteLoading]);

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply Search Filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
                transaction.description?.toLowerCase().includes(searchLower)
            );
        }

        // Apply Recurring Filter
        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === "recurring") return transaction.isRecurring;
                return !transaction.isRecurring;
            })
        }

        // Apply Types Filter
        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
        }

        // Apply Sorting
        result.sort((a, b) => {
            let comparison = 0
            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;

                case "amount":
                    comparison = a.amount - b.amount;
                    break;

                case "date":
                    comparison = a.category.localeCompare(b.category);
                    break;

                default:
                    comparison = 0;
            }
            return sortConfig.direction === "asc" ? comparison : ~comparison;
        })
        return result;
    }, [
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig,
    ]);

    const handleSort = (field) => {
        setSortConfig(current => ({
            field,
            direction:
                current.field == field && current.direction == "asc" ? "desc" : "asc"
        }))
    };

    const handleSelect = (id) => {
        setSelectedIds(current => current.includes(id)
            ? current.filter(item => item != id)
            : [...current, id]);
    };
    const handleSelectAll = () => {
        setSelectedIds((current) =>
            current.length === filteredAndSortedTransactions.length
                ? []
                : filteredAndSortedTransactions.map(t => t.id)
        );
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectedIds([]);
    };

    const itemsPerPage = 20;
    const totalPages = Math.ceil((filteredAndSortedTransactions?.length || 0) / itemsPerPage);
    const [currentPage, setPage] = useState(1);

    // Slice only the current page's data
    const paginatedData = filteredAndSortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            {/* Loading screen when Deleting the transactions */}
            {deleteLoading &&
                (<BarLoader className='mt-4' width={"100%"} color="#9333ea" loading={deleteLoading} />)
            }

            {/* Search Filters */}

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input className='pl-8' placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="flex flex-row gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedIds.length > 0 && (
                        <div className='flex items-center gap-2'>
                            <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
                                <Trash className='h-4 w-4' />
                                Delete Selected ({selectedIds.length})
                            </Button>
                        </div>
                    )}

                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button variant='outline' size='icon' onClick={handleClearFilters} title='Clear Filters'><X className='h-4 w-5' /></Button>
                    )}
                </div>
            </div>

            {/* Transactions */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox onCheckedChange={handleSelectAll} />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                            <div className='flex items-center'>
                                Date {sortConfig.field === "date" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ) : (
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
                            </div>
                        </TableHead>
                        <TableHead>
                            Description
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                            <div className='flex items-center'>
                                Category{sortConfig.field === "category" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ) : (
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                            <div className='flex items-center justify-end'>
                                Amount{sortConfig.field === "amount" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ) : (
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
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
                        filteredAndSortedTransactions.slice(currentPage * 20 - 20, currentPage * 20).map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    <Checkbox onCheckedChange={() => handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)} />
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
                                            <TooltipTrigger>
                                                <Badge variant='outline' className='gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200'>
                                                    <RefreshCw className='w-3 h-3' />
                                                    {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="text-sm">
                                                    <div className="font-medium">
                                                        Next Date:
                                                    </div>
                                                    <div className="">
                                                        {format(new Date(transaction.nextRecurringDate), "PP")}
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Badge variant='outline gap-1'><Clock className='w-3 h-3' />One-time</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                                <MoreHorizontal className='h-4 w-4' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    router.push(
                                                        `/transaction/create?edit=${transaction.id}`
                                                    )

                                                }}>Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className='text-destructive' onClick={() => deleteFn([transaction.id])}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
            {totalPages > 0 && (
                <div className="pagination-container">
                    <button
                        className="page-button"
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                    >
                        <MoveLeftIcon />
                    </button>

                    <span className="page-label">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className="page-button"
                        disabled={currentPage === totalPages}
                        onClick={() => setPage(currentPage + 1)}
                    >
                        <MoveRightIcon />
                    </button>
                </div>

            )}
        </div>
    )
}

export default TransactionTable