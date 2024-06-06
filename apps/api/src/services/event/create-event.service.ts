import prisma from "@/prisma";
import { Event } from "@prisma/client";

interface CreateEventBody
  extends Omit<Event, "deletedAt" | "createdAt" | "updatedAt" | "thumbnail"> {
  voucherCode?: string;
  voucherAmount?: number;
  voucherLimit?: number;
  voucherExpDate?: string; 
}

export const createEventService = async (
  body: CreateEventBody,
  file: Express.Multer.File
) => {
  try {
    const {
      startEvent,
      endEvent,
      price,
      isFree,
      title,
      userId,
      booked,
      stock,
      voucherCode,
      voucherLimit,
      voucherAmount,
      voucherExpDate,
    } = body;

    const existingEvent = await prisma.event.findFirst({
      where: { title },
      orderBy: { endEvent: "desc" },
    });

    if (existingEvent) {
      const existingEndDate = new Date(existingEvent.endEvent);
      const newStartDate = new Date(startEvent);

      console.log('Existing Event End Date:', existingEndDate);
      console.log('New Event Start Date:', newStartDate);


      if (existingEndDate >= newStartDate) {
        throw new Error("An event with the same title is still ongoing");
      }
    }

    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (user?.role !== "organizer") {
      throw new Error("User does not have permission to create an event");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const createEvent = await prisma.event.create({
      data: {
        title,
        category: body.category,
        location: body.location,
        description: body.description,
        booked: Number(booked),
        price: Number(price),
        thumbnail: `/images/${file.filename}`,
        userId: Number(userId),
        startEvent: new Date(startEvent),
        endEvent: new Date(endEvent),
        stock: Number(stock),
        isFree: Boolean(isFree),
      },
    });

    let createVoucher = null;
    if (
      voucherAmount &&
      voucherLimit &&
      voucherCode &&
      voucherExpDate
    ) {
     
      const parsedVoucherExpDate = new Date(voucherExpDate).toISOString();

      createVoucher = await prisma.voucher.create({
        data: {
          code: voucherCode,
          discountAmount: Number(voucherAmount),
          limit: Number(voucherLimit),
          expirationDate: parsedVoucherExpDate, 
          eventId: createEvent.id, 
          userId: Number(userId),
        },
      });
    }

    return {
      event: createEvent,
      voucher: createVoucher,
    };
  } catch (error) {
    throw error;
  }
};
