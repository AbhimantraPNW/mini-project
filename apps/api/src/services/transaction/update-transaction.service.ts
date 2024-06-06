import prisma from "@/prisma";

interface UpdateTransactionBody {
  eventId: number;
  transactionId: number;
  status: string;
}

export const updateTransactionService = async (body: UpdateTransactionBody) => {
  try {
    const { eventId, transactionId, status } = body;

    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
      include: { user: { include: { points: true } } },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const updatedTransaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
      });

      if (status === "Reject") {
        await prisma.event.update({
          where: { id: eventId },
          data: {
            stock: {
              increment: transaction.amount,
            },
            booked: {
              decrement: transaction.amount,
            },
          },
        });
      }

      // if (status === "Accept") {
      //   await prisma.event.update({
      //     where: { id: eventId },
      //     data: {
      //       stock: {
      //         decrement: transaction.amount,
      //       },
      //       booked: {
      //         increment: transaction.amount,
      //       },
      //     },
      //   });
      // }

      return newTransaction;
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
