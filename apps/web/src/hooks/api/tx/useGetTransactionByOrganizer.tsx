"use client";

import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { Transaction } from "@/types/transaction.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetTransactionQueries extends IPaginationQueries {
  // id: number;
}

const useGetTransactionsByOrganizer = (queries: IGetTransactionQueries) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getTransactions = async () => {
    try {
      const { data } = await axiosInstance.get(
        `transactions/dashboard/transaction`,
        { params: queries },
      );
      setData(data.data)
      setMeta(data.meta);

    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions()
  }, [queries.page])

  return { data, meta, refecth: getTransactions };
};

export default useGetTransactionsByOrganizer;
