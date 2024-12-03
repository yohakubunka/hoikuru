import CategoriesAdd from "./category-add";
import CategorieData from "./category-data";

export default function Categories () {
    return (
        <>
                 <div className="">
        <div className="m-8 w-full">
          <CategoriesAdd />
          <CategorieData />
        </div>
      </div>
        </>
    );
}