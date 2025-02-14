import { createReviewService } from "@/services/review/create-review.service";
import { getReviewService } from "@/services/review/get-review";
import { Request, Response } from "express";

export class ReviewController {
  async createReviewController(req: Request, res: Response) {
    try {
      const result = await createReviewService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      throw error;
    }
  }

  async getReviewController(req: Request, res: Response) {
    try {
      const id = req.params.id
      const result = await getReviewService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      throw error;
    }
  }
}
