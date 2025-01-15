import ProductCard from "@/components/shared/product/product-card";
import {Button} from "@/components/ui/button";
import {getAllCategories, getAllProducts} from "@/lib/actions/product.actions";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search Result",
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  // This will construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = {q, category, price, sort, rating, page};

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params)}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      {/* Left Side */}
      <div className='filter-links'>
        {/* Category Links */}
        <div className='text-xl mb-2 mt-3'>Categories</div>
        <div>
          <ul>
            <li>
              {/* Any Category */}
              <Link
                className={`${
                  (category === " " || category === "all") && "font-bold text-yellow-500"
                }`}
                href={getFilterUrl({c: "all"})}
              >
                {" "}
                Any
              </Link>
            </li>
            {/* Individual Categories */}
            <li className='flex flex-col'>
              {categories.map((c) => (
                <Link
                  key={c.category}
                  className={`${category === c.category && "font-bold text-yellow-500"}`}
                  href={getFilterUrl({c: c.category})}
                >
                  {c.category}
                </Link>
              ))}
            </li>
          </ul>
        </div>
        {/* Price Links */}
        <div className='text-xl mb-2 mt-6'>Price</div>
        <div>
          <ul>
            <li>
              {/* Any Price */}
              <Link
                className={`${(price === " " || price === "all") && "font-bold text-yellow-500"}`}
                href={getFilterUrl({p: "all"})}
              >
                {" "}
                Any
              </Link>
            </li>
            {/* Individual Price */}
            <li className='flex flex-col'>
              {prices.map((p) => (
                <div key={p.name}>
                  <Link
                    className={`${price === p.value && "font-bold text-yellow-500"}`}
                    href={getFilterUrl({p: p.value})}
                  >
                    {p.name}
                  </Link>
                </div>
              ))}
            </li>
          </ul>
        </div>
        {/* Rating Links */}
        <div className='text-xl mb-2 mt-6'>Customer Ratings</div>
        <div>
          <ul>
            <li>
              {/* Any Rating */}
              <Link
                className={`${(rating === " " || rating === "all") && "font-bold text-yellow-500"}`}
                href={getFilterUrl({r: "all"})}
              >
                {" "}
                Any
              </Link>
            </li>
            {/* Individual Rating */}
            <li className='flex flex-col'>
              {ratings.map((r) => (
                <div key={r}>
                  <Link
                    className={`${rating === r.toString() && "font-bold text-yellow-500"}`}
                    href={getFilterUrl({r: r.toString()})}
                  >
                    {`${r} stars and up`}
                  </Link>
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>
      {/* Right Side */}
      <div className='md:col-span-4 space-y-4'>
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center'>
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && " Category: " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Rating: " + rating + " stars and up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            price !== "all" ||
            rating !== "all" ? (
              <Button variant='outline' size='sm' asChild className='ml-2'>
                <Link href='/search'>Clear</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {products.data.length === 0 && <div>No products found.</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
