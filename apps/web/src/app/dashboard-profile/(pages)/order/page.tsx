"use client";

import AuthGuardUser from "@/hoc/AuthGuard";
import SidebarProfile from "../../components/SidebarProfile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import useGetTransactionUser from "@/hooks/api/transaction/useGetTransactionUser";
import { useState } from "react";
import Pagination from "@/components/Pagination";

const Order = () => {
  const [page, setPage] = useState<number>(1);
  const { id } = useAppSelector((state) => state.user);
  const { data, meta } = useGetTransactionUser({
    userId: id,
    page,
    take: 8,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const startIndex = (page - 1) * (meta?.take || 0);

  return (
    <div className="grid grid-cols-4 bg-slate-300">
      <SidebarProfile />
      <div className="col-span-3 ">
        <div className="flex h-screen flex-col justify-start">
          <div className="ml-28 mr-10 mt-3 flex h-[40px] items-center justify-start rounded-full bg-red-500 pl-10 text-2xl font-bold text-white">
            Your Order
          </div>
          <div className="ml-48 mr-28 mt-[27px] flex h-[69vh] w-[750px] justify-center rounded-xl bg-white px-5 text-black">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((transaction, index) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>{transaction.event.title}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.total}</TableCell>
                    <TableCell className="text-right">
                      {transaction.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mr-16 mt-4 flex justify-end">
            <Pagination
              total={meta?.total || 0}
              take={meta?.take || 0}
              onChangePage={handleChangePaginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthGuardUser(Order);
