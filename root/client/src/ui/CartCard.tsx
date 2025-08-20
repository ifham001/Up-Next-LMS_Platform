import Image from "next/image";
import Button from "@/ui/Button";

type CartCardProps = {
  item: {
    id: string;
    title: string;
    tagline: string;
    price: number;
    url: string;
  };
  miniCart?: boolean;
  onRemove?: (id: string) => void;
};

export default function CartCard({ item, miniCart = false, onRemove }: CartCardProps) {
  return (
    <div
      className={`flex items-center bg-white rounded-xl shadow-sm ${
        miniCart ? "p-3" : "p-4"
      }`}
    >
      <div
        className={`bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ${
          miniCart ? "w-20 h-16" : "w-28 h-20"
        }`}
      >
        <Image
          className="w-full h-full object-cover"
          src={item.url}
          alt={item.title}
          width={500}
          height={500}
        />
      </div>

      <div className={`${miniCart ? "ml-3" : "ml-4"} flex-1`}>
        <h2
          className={`text-gray-700 font-semibold ${
            miniCart ? "text-sm" : "text-base"
          }`}
        >
          {item.title}
        </h2>
        <p className={`text-gray-500 ${miniCart ? "text-xs" : "text-sm"}`}>
          By {item.tagline}
        </p>
        <p
          className={`text-gray-700 font-bold mt-1 ${
            miniCart ? "text-sm" : "text-base"
          }`}
        >
          ₹ {item.price}
        </p>
      </div>

      {!miniCart && (
        <Button
          className="bg-red-900 ml-2"
          onClick={() => onRemove && onRemove(item.id)}
        >
          Remove
        </Button>
      )}
    </div>
  );
}
