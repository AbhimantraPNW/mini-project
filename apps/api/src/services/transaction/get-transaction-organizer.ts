import prisma from "@/prisma";
import { PaginationQueryParams } from "@/types/pagination.type";
import { Prisma } from "@prisma/client";

interface GetTransactionsQuery extends PaginationQueryParams {
  // id: number;
  // search: string;
}

export const getTransactionByOrganizerService = async (
  query: GetTransactionsQuery,
) => {
  try {
    const { page, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      // title : {contains: search},
      // userId: Number(id),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: { user: true, event: true },
    });

    const count = await prisma.transaction.count({ where: whereClause });

    return {
      data: transactions,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
