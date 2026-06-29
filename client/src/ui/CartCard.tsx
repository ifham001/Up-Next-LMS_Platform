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
      className={`group card-interactive flex items-center ${
        miniCart ? "p-3" : "p-4"
      }`}
    >
      <div
        className={`rounded-md overflow-hidden flex-shrink-0 border border-border ${
          miniCart ? "w-20 h-16" : "w-28 h-20"
        }`}
      >
        <Image
          className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          src={item.url}
          alt={item.title}
          width={500}
          height={500}
        />
      </div>

      <div className={`${miniCart ? "ml-3" : "ml-4"} flex-1 min-w-0`}>
        <h2
          className={`font-display font-semibold text-text-primary truncate ${
            miniCart ? "text-sm" : "text-base"
          }`}
        >
          {item.title}
        </h2>
        <p className={`text-text-muted truncate ${miniCart ? "text-xs" : "text-sm"}`}>
          By {item.tagline}
        </p>
        <span
          className={`font-display tnum font-semibold text-text-primary mt-1.5 block ${
            miniCart ? "text-sm" : "text-base"
          }`}
        >
          ₹ {item.price}
        </span>
      </div>

      {!miniCart && (
        <Button
          variant="danger"
          size="sm"
          className="ml-2"
          onClick={() => onRemove && onRemove(item.id)}
        >
          Remove
        </Button>
      )}
    </div>
  );
}
