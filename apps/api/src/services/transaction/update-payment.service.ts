import prisma from "@/prisma";
import { scheduleJob } from "node-schedule";

const updateTransactionStatus = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: "Pending",
        paymentProof: { not: null }, 
      },
    });

    for (const transaction of transactions) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "Waiting" },
      });
    }

    console.log("Updated transaction statuses:", transactions.length);
  } catch (error) {
    console.log("Error updating transaction statuses:", error);
  }
};

const cronJob = new Date(Date.now() + 60 * 1000); 
scheduleJob("*/1 * * * *", async () => {
  await updateTransactionStatus();
});

export const updatePaymentProofService = async (
  id: number,
  file: Express.Multer.File,
) => {
  try {
    const updatePayment = await prisma.transaction.findFirst({
      where: { id },
    });

    if (!updatePayment) {
      throw new Error("Transaction not found");
    }
    
    if (file) {
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: { paymentProof: `payment/${file.filename}` },
      });

      await updateTransactionStatus();

      return updatedTransaction;
    }
    return updatePayment; 
  } catch (error) {
    throw error;
  }
};
