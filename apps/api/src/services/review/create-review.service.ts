import prisma from "@/prisma"
import { Review } from "@prisma/client";

interface CreateReviewBody extends Omit<Review, "id" > {}

export const createReviewService = async (body: CreateReviewBody) => {
  try {
    const { userId, eventId, rating, comment } = body;

    const user = await prisma.review.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const event = await prisma.event.findFirst({
      where: { id: Number(eventId) },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const currentDate = new Date();
    if (currentDate < new Date(event.endEvent)) {
      throw new Error("You cant review the event before it ends");
    }

    return await prisma.review.create({
      data: {
        comment,
        rating: Number(rating),
        userId: Number(userId),
        eventId: Number(eventId),
      },
    });
  } catch (error) {
    throw error;
  }
};
