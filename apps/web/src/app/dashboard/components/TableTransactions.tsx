import { TableCell, TableRow } from '@/components/ui/table';
import useAcceptTransaction from '@/hooks/api/tx/useAcceptTransactions';
import useRejectTransaction from '@/hooks/api/tx/useRejectionTransactions';
import { CircleCheck, CircleXIcon } from 'lucide-react';
import React, { FC } from 'react'

interface TransactionRowTableProps {
    key: number;
    transactionId: number;
    username: string
    title: string
    quantity: number
    price: number
    amount: number
    status: string
}

const TableTransactions: FC<TransactionRowTableProps> = ({
    key,
    title,
    amount,
    price,
    quantity,
    status,
    transactionId,
    username,
}) => {
    const { accepting } = useAcceptTransaction()
    const { rejecting } = useRejectTransaction()
    const values = { id: Number(transactionId) }

    return (
        <TableRow key={key} >
            <TableCell className="uppercase font-medium">{username}</TableCell>
            <TableCell className='capitalize'>{title}</TableCell>
            <TableCell>{quantity}</TableCell>
            <TableCell>{price}</TableCell>
            <TableCell>{amount}</TableCell>
            <TableCell>{status}</TableCell>

            {/* <TableCell><div className='flex gap-2'>
                <CircleXIcon onClick={() => { rejecting(values) }} className='text-mythemes-red cursor-pointer hover:text-mythemes-red/80' />
                <CircleCheck onClick={() => { accepting(values) }} className='text-green-600 cursor-pointer hover:text-green-600/80' />
            </div></TableCell> */}
        </TableRow>
    )
}

export default TableTransactions


