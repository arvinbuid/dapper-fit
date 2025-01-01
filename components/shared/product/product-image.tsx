"use client";

import Image from "next/image";
import {useState} from "react";
import {cn} from "@/lib/utils";

const ProductImages = ({images}: {images: string[]}) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className='space-y-4'>
      <Image
        src={images[current]}
        alt='Product Image'
        width={1000}
        height={1000}
        priority={true}
        className='object-fit object-cover min-h-[300px]'
      />
      <div className='flex'>
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "border hover:border-yellow-500 mr-2 p-1 cursor-pointer",
              current === index && "border-yellow-500"
            )}
          >
            <Image src={image} alt='Product Image' width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
