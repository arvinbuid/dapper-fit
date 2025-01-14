import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {getAllCategories} from "@/lib/actions/product.actions";
import {SearchIcon} from "lucide-react";

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action='/search' method='GET'>
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Select name='category'>
          <SelectTrigger className='w-[100px]'>
            <SelectValue placeholder='All' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key='All' value='all'>
              All
            </SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.category} value={item.category}>
                {item.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className='flex gap-2'>
          <Input
            name='q'
            placeholder='Search...'
            className='hidden sm:block sm:w-[150px] lg:w-[200px]'
          />
          <Button>
            <SearchIcon />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Search;
