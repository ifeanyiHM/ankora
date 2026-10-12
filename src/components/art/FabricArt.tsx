import type { FabricPattern } from "@/types";
import { useId, type ReactNode } from "react";

interface Props {
  pattern: FabricPattern;
  /** First colour is the ground, the rest are used for the motif */
  colors: string[];
  className?: string;
}

const W = 400;
const H = 500;

/**
 * Generated fabric swatches. They stand in for product photos until real images are set
 * in src/data/images.ts, and act as the fallback if a photo fails to load.
 */
export function FabricArt({ pattern, colors, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${uid}${n}`;
  const c = (i: number) => colors[i] ?? colors[colors.length - 1] ?? "#888888";
  const [c0, c1, c2, c3] = [c(0), c(1), c(2), c(3)];
  const ground = <rect width={W} height={H} fill={c0} />;
  const tile = (
    n: string,
    w: number,
    h: number,
    body: ReactNode,
    extra?: string,
  ) => (
    <pattern
      id={id(n)}
      width={w}
      height={h}
      patternUnits="userSpaceOnUse"
      patternTransform={extra}
    >
      {body}
    </pattern>
  );
  const fill = (n: string) => (
    <rect width={W} height={H} fill={`url(#${id(n)})`} />
  );

  let body: ReactNode;

  switch (pattern) {
    case "aso-oke": {
      const seq = [
        [34, c0],
        [5, c1],
        [9, c2],
        [5, c1],
        [34, c0],
        [14, c1],
        [6, c2],
        [14, c1],
      ] as const;
      const bars: ReactNode[] = [];
      for (let x = 0, i = 0; x < W; i++) {
        const [w, f] = seq[i % seq.length];
        bars.push(<rect key={i} x={x} width={w} height={H} fill={f} />);
        x += w;
      }
      body = (
        <>
          {ground}
          {bars}
          {[100, 200, 300].map((x) => (
            <rect
              key={x}
              x={x}
              width={1.6}
              height={H}
              fill="#000"
              opacity={0.2}
            />
          ))}
          <defs>
            {tile(
              "weft",
              W,
              5,
              <rect width={W} height={1.2} fill="#000" opacity={0.14} />,
            )}
          </defs>
          {fill("weft")}
        </>
      );
      break;
    }
    case "adire": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "ring",
              100,
              100,
              <>
                <circle
                  cx={50}
                  cy={50}
                  r={35}
                  fill="none"
                  stroke={c1}
                  strokeWidth={5}
                />
                <circle
                  cx={50}
                  cy={50}
                  r={25}
                  fill="none"
                  stroke={c2}
                  strokeWidth={3}
                  opacity={0.9}
                />
                <circle
                  cx={50}
                  cy={50}
                  r={15}
                  fill="none"
                  stroke={c1}
                  strokeWidth={5}
                />
                <circle cx={50} cy={50} r={5} fill={c2} />
                {[
                  [0, 0],
                  [100, 0],
                  [0, 100],
                  [100, 100],
                ].map(([x, y]) => (
                  <g key={`${x}${y}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={20}
                      fill="none"
                      stroke={c1}
                      strokeWidth={4}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={9}
                      fill="none"
                      stroke={c2}
                      strokeWidth={2.5}
                    />
                  </g>
                ))}
              </>,
              "rotate(7)",
            )}
          </defs>
          {fill("ring")}
        </>
      );
      break;
    }
    case "akwete": {
      const rows: ReactNode[] = [];
      for (let k = 0, y = 18; y < H; k++, y += 62) {
        if (k % 3 === 0) {
          const pts = (o: number) =>
            Array.from(
              { length: 21 },
              (_, i) => `${i * 20},${y + o + (i % 2 ? 0 : 24)}`,
            ).join(" ");
          rows.push(
            <polyline
              key={k}
              points={pts(0)}
              fill="none"
              stroke={c1}
              strokeWidth={5}
              strokeLinejoin="miter"
            />,
            <polyline
              key={`${k}b`}
              points={pts(11)}
              fill="none"
              stroke={c2}
              strokeWidth={3}
            />,
          );
        } else if (k % 3 === 1) {
          for (let x = 20; x < W + 20; x += 40) {
            rows.push(
              <polygon
                key={`${k}-${x}`}
                points={`${x},${y - 4} ${x + 17},${y + 14} ${x},${y + 32} ${x - 17},${y + 14}`}
                fill={c2}
              />,
              <polygon
                key={`${k}-${x}i`}
                points={`${x},${y + 4} ${x + 9},${y + 14} ${x},${y + 24} ${x - 9},${y + 14}`}
                fill={c1}
              />,
            );
          }
        } else {
          rows.push(
            <rect key={k} y={y + 6} width={W} height={4} fill={c1} />,
            <rect key={`${k}b`} y={y + 20} width={W} height={4} fill={c2} />,
            <rect
              key={`${k}c`}
              y={y + 12}
              width={W}
              height={2}
              fill={c0 === c1 ? c2 : "#000"}
              opacity={0.35}
            />,
          );
        }
      }
      body = (
        <>
          {ground}
          {rows}
        </>
      );
      break;
    }
    case "george": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "rose",
              90,
              90,
              <>
                {Array.from({ length: 8 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={45}
                    cy={30}
                    rx={6}
                    ry={14}
                    fill="none"
                    stroke={c1}
                    strokeWidth={1.8}
                    transform={`rotate(${i * 45} 45 45)`}
                  />
                ))}
                <circle cx={45} cy={45} r={5.5} fill={c2} />
                <circle
                  cx={45}
                  cy={45}
                  r={32}
                  fill="none"
                  stroke={c1}
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
                {[
                  [0, 0],
                  [90, 0],
                  [0, 90],
                  [90, 90],
                  [45, 0],
                  [45, 90],
                  [0, 45],
                  [90, 45],
                ].map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill={c3} />
                ))}
              </>,
            )}
          </defs>
          {fill("rose")}
        </>
      );
      break;
    }
    case "ankara": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "wax",
              130,
              130,
              <>
                <circle cx={65} cy={65} r={44} fill={c1} />
                <circle cx={65} cy={65} r={36} fill={c3} />
                <circle cx={65} cy={65} r={26} fill={c2} />
                <circle cx={65} cy={65} r={14} fill={c3} />
                <circle cx={65} cy={65} r={6} fill={c1} />
                {[
                  [0, 0],
                  [130, 130],
                ].map(([x, y]) => (
                  <g key={`${x}`}>
                    <circle cx={x} cy={y} r={30} fill={c2} />
                    <circle cx={x} cy={y} r={18} fill={c3} />
                    <circle cx={x} cy={y} r={8} fill={c1} />
                  </g>
                ))}
                {[
                  [130, 0],
                  [0, 130],
                ].map(([x, y]) => (
                  <polygon
                    key={`${x}${y}`}
                    points={`${x},${y - 20} ${x + 20},${y} ${x},${y + 20} ${x - 20},${y}`}
                    fill={c1}
                  />
                ))}
                {[
                  [65, 8],
                  [65, 122],
                  [8, 65],
                  [122, 65],
                ].map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={c3} />
                ))}
              </>,
            )}
          </defs>
          {fill("wax")}
        </>
      );
      break;
    }

    case "hollandais": {
      const fan = (
        cx: number,
        cy: number,
        radii: number[],
        fills: string[],
        side: "up" | "right" | "left",
      ) =>
        radii.map((r, i) => {
          const d =
            side === "up"
              ? `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}Z`
              : side === "right"
                ? `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}Z`
                : `M${cx} ${cy + r} A${r} ${r} 0 0 1 ${cx} ${cy - r}Z`;
          return (
            <path key={`${side}${i}`} d={d} fill={fills[i % fills.length]} />
          );
        });
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "fan",
              140,
              140,
              <>
                {fan(70, 140, [66, 54, 42, 30, 18], [c1, c3, c2, c3, c1], "up")}
                {fan(0, 70, [32, 22, 12], [c2, c3, c1], "right")}
                {fan(140, 70, [32, 22, 12], [c2, c3, c1], "left")}
                <circle cx={70} cy={22} r={7} fill={c3} />
                <circle cx={70} cy={22} r={3.5} fill={c1} />
                <circle cx={30} cy={30} r={3} fill={c3} />
                <circle cx={110} cy={30} r={3} fill={c3} />
              </>,
            )}
            {tile(
              "crackle",
              200,
              200,
              <g fill="none" stroke="#000" strokeWidth={0.8} opacity={0.2}>
                <path d="M10 20 l14 18 l-6 22 l18 12" />
                <path d="M120 10 l-10 20 l16 14" />
                <path d="M150 120 l18 -12 l4 20 l16 8" />
                <path d="M40 160 l12 -16 l20 6" />
                <path d="M90 90 l-14 12 l8 18" />
              </g>,
            )}
          </defs>
          {fill("fan")}
          {fill("crackle")}
        </>
      );
      break;
    }
    case "lace": {
      const petals = Array.from(
        { length: 6 },
        (_, i) =>
          [
            42 + 13 * Math.cos((i * Math.PI) / 3),
            42 + 13 * Math.sin((i * Math.PI) / 3),
          ] as const,
      );
      const hem: ReactNode[] = [];
      for (let x = 0; x < W; x += 40)
        hem.push(
          <path
            key={x}
            d={`M${x} ${H} A20 20 0 0 1 ${x + 40} ${H}Z`}
            fill={c1}
          />,
          <path
            key={`${x}i`}
            d={`M${x + 8} ${H} A12 12 0 0 1 ${x + 32} ${H}Z`}
            fill={c0}
          />,
        );
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "lace",
              84,
              84,
              <>
                {petals.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke={c1}
                    strokeWidth={1.8}
                  />
                ))}
                <circle cx={42} cy={42} r={5} fill={c1} />
                <circle
                  cx={42}
                  cy={42}
                  r={28}
                  fill="none"
                  stroke={c1}
                  strokeWidth={1.2}
                  strokeDasharray="2 4"
                />
                {[
                  [0, 0],
                  [84, 0],
                  [0, 84],
                  [84, 84],
                ].map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={c1} />
                ))}
                {[
                  [21, 21],
                  [63, 63],
                  [63, 21],
                  [21, 63],
                ].map(([x, y]) => (
                  <circle
                    key={`${x}${y}`}
                    cx={x}
                    cy={y}
                    r={2.2}
                    fill="none"
                    stroke={c1}
                    strokeWidth={1.2}
                  />
                ))}
              </>,
            )}
          </defs>
          {fill("lace")}
          {hem}
        </>
      );
      break;
    }
    case "guinea-brocade": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "gb",
              56,
              64,
              <>
                <path
                  d="M28 4 L50 32 L28 60 L6 32Z"
                  fill="none"
                  stroke={c1}
                  strokeWidth={1.5}
                  opacity={0.55}
                />
                <path
                  d="M28 20 L38 32 L28 44 L18 32Z"
                  fill={c1}
                  opacity={0.35}
                />
                {[
                  [0, 0],
                  [56, 0],
                  [0, 64],
                  [56, 64],
                ].map(([x, y]) => (
                  <circle
                    key={`${x}${y}`}
                    cx={x}
                    cy={y}
                    r={2.5}
                    fill={c1}
                    opacity={0.6}
                  />
                ))}
              </>,
            )}
          </defs>
          {fill("gb")}
          <polygon points="0,0 170,0 0,210" fill="#fff" opacity={0.07} />
          <polygon
            points="400,500 230,500 400,290"
            fill="#000"
            opacity={0.06}
          />
        </>
      );
      break;
    }

    case "velvet": {
      const folds = Array.from({ length: 8 }, (_, i) => {
        const x = -120 + i * 80;
        const f =
          i % 3 === 0
            ? { c: c1, o: 0.34 }
            : i % 3 === 1
              ? { c: "#000", o: 0.16 }
              : { c: "#fff", o: 0.07 };
        return (
          <polygon
            key={i}
            points={`${x + 190},0 ${x + 260},0 ${x + 40},${H} ${x - 30},${H}`}
            fill={f.c}
            opacity={f.o}
          />
        );
      });
      body = (
        <>
          {ground}
          {folds}
          <defs>
            {tile(
              "pile",
              4,
              4,
              <circle cx={2} cy={2} r={0.7} fill="#fff" opacity={0.08} />,
            )}
          </defs>
          {fill("pile")}
        </>
      );
      break;
    }
    case "senator": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "twill",
              10,
              10,
              <path
                d="M-2 12 L12 -2 M-2 2 L2 -2 M8 12 L12 8"
                stroke={c1}
                strokeWidth={1.3}
                opacity={0.3}
              />,
            )}
          </defs>
          {fill("twill")}
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={20 + i * 40}
              width={1.6}
              height={H}
              fill={c1}
              opacity={0.35}
            />
          ))}
        </>
      );
      break;
    }
    case "brocade": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "bc",
              80,
              80,
              <>
                <path
                  d="M0 40 L40 0 L80 40 L40 80Z"
                  fill="none"
                  stroke={c1}
                  strokeWidth={1.8}
                />
                {[
                  [33, 40],
                  [47, 40],
                  [40, 33],
                  [40, 47],
                ].map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={5.5} fill={c2} />
                ))}
                <circle cx={40} cy={40} r={3} fill={c1} />
                {[
                  [0, 0],
                  [80, 0],
                  [0, 80],
                  [80, 80],
                ].map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={3.5} fill={c1} />
                ))}
              </>,
            )}
          </defs>
          {fill("bc")}
        </>
      );
      break;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {body}
    </svg>
  );
}
