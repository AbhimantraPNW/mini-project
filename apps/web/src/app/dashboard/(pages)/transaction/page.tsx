"use client";

import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AuthGuardOrganizer from "@/hoc/AuthGuardOrganizer";
import useAcceptTransaction from "@/hooks/api/tx/useAcceptTransactions";
import useRejectTransaction from "@/hooks/api/tx/useRejectionTransactions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import useGetTransactionsByOrganizer from "@/hooks/api/tx/useGetTransactionByOrganizer";

const Transactions = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { accepting } = useAcceptTransaction();
  const { rejecting } = useRejectTransaction();
  const { data, meta } = useGetTransactionsByOrganizer({
    page,
    take: 8,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleAccept = (transactionId: number, eventId: number) => {
    accepting({ id: transactionId, status: "Accept", eventId });
  };

  const handleReject = (transactionId: number, eventId: number) => {
    rejecting({ id: transactionId, status: "Reject", eventId });
  };

  return (
    <div className="mb-14 grid h-screen grid-cols-4">
      <Sidebar />
      <div className="col-span-3 bg-white">
        <div className="mr-5 mt-5 flex h-20 w-auto items-center justify-between rounded-2xl bg-slate-300 pl-5 text-red-600">
          <div className="text-4xl font-bold">Transactions</div>
        </div>
        <div className="ml-4 mr-10 mt-7 flex justify-center">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Event</TableHead>
                {/* <TableHead>Price</TableHead> */}
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((transaction, index) => (
                <TableRow>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.event.title}</TableCell>
                  {/* <TableCell>200000</TableCell> */}
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.total}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className="mr-2 rounded bg-green-500 px-4 py-2 text-white"
                      onClick={() =>
                        handleAccept(transaction.id, transaction.eventId)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="mr-2 rounded bg-red-500 px-4 py-2 text-white"
                      onClick={() =>
                        handleReject(transaction.id, transaction.eventId)
                      }
                    >
                      Reject
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Pagination
            total={meta?.total || 0}
            take={meta?.take || 0}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthGuardOrganizer(Transactions);
