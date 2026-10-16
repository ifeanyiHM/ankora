import { cn } from "@/lib/cn";
import Image from "next/image";

export function Logo({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Image
      src={light ? "/ankora_logo_white.png" : "/ankora_logo.png"}
      alt="Ankora"
      width={734}
      height={588}
      className={cn(
        !light && "size-14 md:size-16 xl1:size-20 xl3:size-24 object-contain ",
        light && "size-20 xl3:size-24 object-contain",
        className,
      )}
      priority
    />
  );
}
