"use client";

import { Card, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TOP_CONCERTS } from "../../constant";
import { Badge } from "./ui/badge";

const TopEvent: React.FC = () => {
  const itemsPerSlide = 3;
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleNextSlide = () => {
    const totalSlides = Math.ceil(TOP_CONCERTS.length / itemsPerSlide);
    setCurrentSlide((prevSlide) => (prevSlide % totalSlides) + 1);
  };

  const handlePreviousSlide = () => {
    if (currentSlide !== 1) {
      const totalSlides = Math.ceil(TOP_CONCERTS.length / itemsPerSlide);
      setCurrentSlide((prevSlide) =>
        prevSlide === 1 ? totalSlides : prevSlide - 1,
      );
    }
  };

  useEffect(() => {
    const handlePrevClick = () => {
      handlePreviousSlide();
    };

    const handleNextClick = () => {
      handleNextSlide();
    };

    const prevTopButton = document.getElementById("prevTopButton");
    const nextTopButton = document.getElementById("nextTopButton");

    if (prevTopButton) {
      prevTopButton.addEventListener("click", handlePrevClick);
    }

    if (nextTopButton) {
      nextTopButton.addEventListener("click", handleNextClick);
    }

    return () => {
      if (prevTopButton) {
        prevTopButton.removeEventListener("click", handlePrevClick);
      }
      if (nextTopButton) {
        nextTopButton.removeEventListener("click", handleNextClick);
      }
    };
  }, [handlePreviousSlide, handleNextSlide]);

  return (
    <>
      <main className="padding-container max-container mt-20 mb-10">
        <h1 className="text-2xl font-bold md:mb-0 mb-3">Top Selling Concert Tours</h1>
        <div className="flex w-full flex-col items-center">
          <Carousel>
            <CarouselContent>
              {TOP_CONCERTS.map(
                (category, index) =>
                  index % itemsPerSlide === 0 && (
                    <CarouselItem
                      key={category.title + index}
                      className="py-12"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                        {TOP_CONCERTS.slice(index, index + itemsPerSlide).map(
                          (concert, subIndex) => (
                            <div
                              key={concert.title + index + subIndex}
                              className="relative"
                            >
                              <Card className="my-16 md:my-0">
                                <div className="md:h-48 h-24">
                                  <div className="relative h-full w-full">
                                    <Image
                                      src={concert.links}
                                      alt={concert.title}
                                      layout="responsive"
                                      objectFit="cover"
                                      width={90}
                                      height={90}
                                      className="transform rounded-md transition-transform hover:scale-105"
                                    />
                                  </div>
                                </div>
                              </Card>
                              <div className="bottom-15 absolute left-0 right-0 bg-white bg-opacity-80 p-2">
                                <CardTitle className="text-center text-black">
                                  {concert.title}
                                </CardTitle>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CarouselItem>
                  ),
              )}
            </CarouselContent>

            <Badge className="absolute right-0 top-0 md:mt-[-40px] mt-[-3px] flex items-center border border-slate-300 bg-white px-20 py-5" />
            <div className="absolute right-0 top-0 mr-16 md:mt-[-30px] mt-2 flex items-center">
              <span>
                {currentSlide} of{" "}
                {Math.ceil(TOP_CONCERTS.length / itemsPerSlide)}
              </span>
              <CarouselPrevious
                id="prevTopButton"
                className="hover:bg-black hover:text-white"
              />
              <CarouselNext
                id="nextTopButton"
                className="hover:bg-black hover:text-white"
              />
            </div>
          </Carousel>
        </div>
      </main>
    </>
  );
};

export default TopEvent;
