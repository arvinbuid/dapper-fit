"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "../ui/button";
import {formUrlQuery} from "@/lib/utils";
import {ArrowLeft, ArrowRight} from "lucide-react";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({page, totalPages, urlParamName}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    // push newUrl into router to change route
    router.push(newUrl);
  };

  return (
    <div className='flex gap-5 mt-4'>
      <Button
        size='sm'
        variant='outline'
        className='w-16'
        disabled={Number(page) <= 1}
        onClick={() => handleClick("prev")}
      >
        <ArrowLeft />
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-16'
        disabled={Number(page) > totalPages}
        onClick={() => handleClick("next")}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default Pagination;
