import prisma from "@/prisma";
import { PaginationQueryParams } from "@/types/pagination.type";
import { Prisma } from "@prisma/client";

interface GetTransactionsQuery extends PaginationQueryParams {
  userId: number;
  // search: string;
}

export const getTransactionClientService = async (
  query: GetTransactionsQuery,
) => {
  try {
    const { userId, page, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      userId: Number(userId),
      // title : {contains: search},
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
