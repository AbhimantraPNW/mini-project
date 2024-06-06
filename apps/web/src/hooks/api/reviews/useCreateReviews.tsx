import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { IFormReview, Review } from "@/types/review.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const useCreateReviews = () => {
  const router = useRouter();
  const { toast } = useToast();
  const createReview = async (payload: IFormReview) => {
    try {
      await axiosInstance.post<Review>("/reviews", {
        ...payload,
      });

      toast({
        title: "Review Success",
        description: "Thanks for your honest review to us.",
      });

      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };
  return { createReview };
};

export default useCreateReviews;
