import { useRouter } from "next/router";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";

function PaginationControls({ Length }: { Length: number }) {
  const router = useRouter();
  const { address, page } = router.query;
  const pageInt = parseInt(page as string);
  return (
    <div className="absolute flex items-center justify-between bottom-2 inset-x-0  rounded-md mx-2 bg-violet-200 lg:mx-auto lg:max-w-sm">
      <button
        disabled={pageInt === 0}
        onClick={() => {
          router.push(`/search/${address}?page=0`);
        }}
        className="text-2xl p-4 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdFirstPage />
      </button>

      <button
        disabled={pageInt === 0}
        onClick={() => {
          router.push(`/search/${address}?page=${pageInt - 1}`);
        }}
        className="p-5 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdArrowBackIos />
      </button>

      <p className="grow text-center text-slate-700">
        {pageInt + 1} - {Length}
      </p>

      <button
        disabled={pageInt === Length - 1}
        onClick={() => {
          router.push(`/search/${router.query.address}?page=${pageInt + 1}`);
        }}
        className="p-5 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdArrowForwardIos />
      </button>

      <button
        disabled={pageInt === Length - 1}
        onClick={() => {
          router.push(`/search/${address}?page=${Length - 1}`);
        }}
        className="text-2xl p-4 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdLastPage />
      </button>
    </div>
  );
}

export default PaginationControls;
