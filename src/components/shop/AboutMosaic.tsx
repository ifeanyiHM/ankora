import { SwatchImage } from "@/components/shop/SwatchImage";
import type { FabricPattern } from "@/types";
import Link from "next/link";

export interface MosaicTile {
  slug: string;
  name: string;
  /** A product photo from this fabric family. Falls back to the generated swatch if there isn't one. */
  image: string | null;
  pattern: FabricPattern;
  colors: string[];
}

const SIZES = "(min-width:1024px) 24vw, 70vw";
// const pill =
//   "absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink transition-colors group-hover:bg-ink group-hover:text-white xl1:bottom-3 xl1:left-3 xl1:px-3 xl1:text-sm xl3:bottom-4 xl3:left-4 xl3:px-3.5 xl3:py-1.5 xl3:text-base";

function Tile({
  tile,
  index,
  className,
}: {
  tile: MosaicTile;
  index: number;
  className: string;
}) {
  return (
    <Link
      href={`/category/${tile.slug}`}
      aria-label={`Shop ${tile.name}`}
      style={{ "--i": index } as React.CSSProperties}
      className={`warp group relative block overflow-hidden rounded-sm ${className}`}
    >
      <SwatchImage
        src={tile.image}
        pattern={tile.pattern}
        colors={tile.colors}
        alt={`${tile.name} fabric`}
        sizes={SIZES}
        className="absolute inset-0"
      />
      {/* <span className={pill}>{tile.name}</span> */}
    </Link>
  );
}

/**
 * A patchwork of fabric photos for the About page: four tiles that interlock like quilt pieces, with a round
 * "medallion" tile overlapping their meeting point and a dashed gold stitch line behind it all, as if the
 * patch were sewn on. Every tile is placed explicitly (column AND row): grid items with only a row set get
 * placed before the others and would push the large tile out of position. Each tile links to its fabric family. Pass up to five tiles, in this order:
 * large, top-right, bottom-right, bottom-left, medallion.
 */
export function AboutMosaic({ tiles }: { tiles: MosaicTile[] }) {
  const [large, topRight, bottomRight, bottomLeft, medallion] = tiles;
  return (
    <div className="relative mx-auto w-full max-w-md md:max-w-lg lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-md xl1:translate-x-4 xl1:translate-y-4 xl3:translate-x-5 xl3:translate-y-5"
      />
      <div className="relative grid aspect-5/6 grid-cols-6 grid-rows-6 gap-1 lg:gap-2 xl1:gap-2.5 xl3:gap-3">
        {large && (
          <Tile
            tile={large}
            index={0}
            className="col-span-4 col-start-1 row-span-4 row-start-1"
          />
        )}
        {topRight && (
          <Tile
            tile={topRight}
            index={1}
            className="col-span-2 col-start-5 row-span-3 row-start-1"
          />
        )}
        {bottomRight && (
          <Tile
            tile={bottomRight}
            index={2}
            className="col-span-2 col-start-5 row-span-3 row-start-4"
          />
        )}
        {bottomLeft && (
          <Tile
            tile={bottomLeft}
            index={3}
            className="col-span-4 col-start-1 row-span-2 row-start-5"
          />
        )}
      </div>

      {medallion && (
        <Link
          href={`/category/${medallion.slug}`}
          aria-label={`Shop ${medallion.name}`}
          style={{ "--i": 4 } as React.CSSProperties}
          className="warp group absolute left-[50%] top-[46%] z-10 block w-[31%]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            fill="none"
            className="absolute inset-[-8%] size-[116%]"
          >
            <circle
              cx="50"
              cy="50"
              r="48.5"
              strokeWidth="1.6"
              strokeDasharray="0.1 3.6"
              strokeLinecap="round"
            />
          </svg>
          <div className="relative aspect-square overflow-hidden rounded-full ring-4 lg:ring-6 xl1:ring-7 xl3:ring-10 ring-white">
            <SwatchImage
              src={medallion.image}
              pattern={medallion.pattern}
              colors={medallion.colors}
              alt={`${medallion.name} fabric`}
              sizes="(min-width:1024px) 12vw, 30vw"
              className="absolute inset-0"
            />
            {/* <span className="absolute inset-x-0 bottom-[9%] mx-auto w-fit rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-ink transition-colors group-hover:bg-ink group-hover:text-white xl1:text-xs xl3:px-3 xl3:text-sm">
              {medallion.name}
            </span> */}
          </div>
        </Link>
      )}
    </div>
  );
}
