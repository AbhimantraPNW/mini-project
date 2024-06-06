import useGetEvent from "@/hooks/api/admin/useGetEvent";
import useCreateTransaction from "@/hooks/api/transaction/useCreateTransaction";
import { useAppSelector } from "@/redux/hooks";
import { Voucher } from "@/types/voucher.type";
import React, { useEffect, useState } from "react";

interface TransactionCardProps {
  eventStock: number;
  pricePerTicket: number;
  eventId: number;
  paramsId: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  eventStock,
  pricePerTicket,
  paramsId,
}) => {
  const { createTransaction } = useCreateTransaction();
  const user = useAppSelector((state) => state.user);
  const { event } = useGetEvent(Number(paramsId));

  const [ticketCount, setTicketCount] = useState(1);
  const [usePoints, setUsePoints] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<Voucher | null>(null);
  const [selectedVoucherDiscount, setSelectedVoucherDiscount] = useState<Voucher | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(pricePerTicket);

  const totalPoints = user.points && user.points.length > 0 ? user.points[0].total : 0;
  const totalPriceTicket = pricePerTicket * ticketCount;

  useEffect(() => {
    const totalPriceTicket = pricePerTicket * ticketCount;
    const discountPercentage = selectedVoucherDiscount ? selectedVoucherDiscount.discountAmount / 100 : 0;
    const totalPriceWithDiscount = totalPriceTicket * (1 - discountPercentage);
    const discountAmount = selectedVoucherCode ? 20000 : 0;
    const finalPrice = totalPriceWithDiscount - (usePoints ? totalPoints : 0) - discountAmount;
    setTotalPrice(Math.max(finalPrice, 0));
  }, [usePoints, ticketCount, selectedVoucherCode, selectedVoucherDiscount]);

  const discountAmount = selectedVoucherCode ? 20000 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddTicket = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleRemoveTicket = () => {
    setTicketCount(ticketCount - 1);
  };

  const handleSelectedVoucherCode = (voucher: Voucher) => {
    setSelectedVoucherCode(voucher);
  };

  const handleSelectedVoucherDiscount = (voucher: Voucher) => {
    setSelectedVoucherDiscount(voucher);
  };

  const handleCheckout = async () => {
    try {
      const payload = {
        userId: user.id,
        eventId: event?.id,
        total: totalPrice,
        amount: ticketCount,
        status: "Pending",
        paymentProof: [] as File[],
        isPointUse: usePoints,
        isUseVoucher: selectedVoucherCode || selectedVoucherDiscount ? true : false,
        userVoucherId: selectedVoucherCode ? selectedVoucherCode?.id : null,
      };

      await createTransaction(payload);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="transaction-card">
      <div className="card-content">
        <h1 className="card-title">Transaction</h1>
        <div className="ticket-info">
          <p>Available Ticket :</p>
          <p>{eventStock - ticketCount}</p>
        </div>
        <div className="price-info">
          <p>Price :</p>
          <span>{formatCurrency(pricePerTicket)}</span>
        </div>

        <div className="ticket-control">
          <button
            className="control-button add-button"
            onClick={handleAddTicket}
            disabled={ticketCount === eventStock}
          >
            +
          </button>
          <input
            type="number"
            value={ticketCount}
            min="1"
            max={eventStock}
            className="ticket-input"
            onChange={(e) =>
              setTicketCount(Math.min(Number(e.target.value), eventStock))
            }
          />
          <button
            className="control-button remove-button"
            onClick={handleRemoveTicket}
            disabled={ticketCount === 1}
          >
            -
          </button>
        </div>

        <div className="subtotal-info">
          <span>Subtotal:</span>
          <span>{formatCurrency(totalPriceTicket)}</span>
        </div>
        {usePoints && (
          <div className="flex justify-end">
            <span className="flex flex-col justify-end">
              <span>{totalPoints}</span>
              <span className="text-right">-</span>
            </span>
          </div>
        )}
        <div className="flex flex-row gap-4">
          {/* Toggle for using points */}
          <label className="mt-2 cursor-pointer rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">
            <input
              type="checkbox"
              checked={usePoints}
              onChange={() => setUsePoints(!usePoints)}
              className="mr-2"
            />
            Use Points
          </label>
        </div>

        {/* Voucher Badge */}
        {event?.Voucher && event?.Voucher?.length > 0 && (
          <div className="mt-5 border border-black p-2">
            <h1 className="font-bold">Click voucher to get discount!</h1>
            {event?.Voucher.map((voucher) => (
              <div key={voucher.id} className="mt-5">
                <p>Voucher Limit : {voucher.limit}</p>
                <div
                  className="flex cursor-pointer flex-row items-center gap-2 rounded-lg"
                  onClick={() => handleSelectedVoucherCode(voucher)}
                >
                  <label className="mt-2 cursor-pointer rounded-lg bg-green-200 px-4 py-2 hover:bg-green-300">
                    {voucher.code}
                  </label>
                </div>
                <div
                  className="mt-2 flex flex-wrap gap-2"
                  onClick={() => handleSelectedVoucherDiscount(voucher)}
                >
                  <label className="mt-2 cursor-pointer rounded-lg bg-blue-300 px-4 py-2 hover:bg-blue-400">
                    Get Discount ({voucher.discountAmount}%)
                  </label>
                </div>
                <div className="mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {(selectedVoucherCode || selectedVoucherDiscount) && (
          <div className="flex flex-col md:text-right">
            {selectedVoucherCode && <p>{formatCurrency(discountAmount)}</p>}
            {selectedVoucherDiscount && (
              <p>
                {formatCurrency(
                  totalPriceTicket *
                    (selectedVoucherDiscount.discountAmount / 100),
                )}
              </p>
            )}
            <p>-</p>
          </div>
        )}

        <div className="total-info">
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="checkout-button">
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
