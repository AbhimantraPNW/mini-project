import { createTransactionService } from "@/services/transaction/create-transaction.service";
import { getTransactionClientService } from "@/services/transaction/get-transaction-client";
import { getTransactionByOrganizerService } from "@/services/transaction/get-transaction-organizer";
import { getTransactionService } from "@/services/transaction/get-transaction.service";
import { updatePaymentProofService } from "@/services/transaction/update-payment.service";
import { updateTransactionService } from "@/services/transaction/update-transaction.service";
import { NextFunction, Request, Response } from "express";

export class TransactionController {
  async createTransactionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createTransactionService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id
      const result = await getTransactionService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionByOrganizerController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        // id: parseInt(req.query.id as string),
        take: parseInt(req.query.take as string) || 15,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || "createdAt",
        sortOrder: (req.query.sortOrder as string) || "asc",
      };

      const result = await getTransactionByOrganizerService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionClientController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        userId: parseInt(req.query.userId as string),
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || "createdAt",
        sortOrder: (req.query.sortOrder as string) || "desc",
      };

      const result = await getTransactionClientService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateTransactionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const { status, eventId } = req.body;

      const result = await updateTransactionService({
        transactionId: Number(id),
        eventId: Number(eventId),
        status,
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentProofController(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      const result = await updatePaymentProofService(
        Number(req.params.id),
        files[0],
      );

      return res.status(200).send(result);
    } catch (error) {
      throw error;
    }
  }
}
