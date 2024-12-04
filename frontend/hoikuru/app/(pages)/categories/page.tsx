import CategorysAdd from "./category-add";
import CategoryData from "./category-data";

export default function Categorys () {
    return (
        <>
                 <div className="">
        <div className="m-8 w-full">
          <CategorysAdd />
          <CategoryData />
        </div>
      </div>
        </>
    );
}