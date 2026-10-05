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
    case "atiku": {
      const diamonds = Array.from({ length: 17 }, (_, i) => i);
      const band = (y: number) => (
        <g key={y}>
          <rect y={y} width={W} height={2} fill={c1} />
          <rect y={y + 22} width={W} height={2} fill={c1} />
          {diamonds.map((i) => (
            <polygon
              key={i}
              points={`${i * 24 + 12},${y + 6} ${i * 24 + 20},${y + 12} ${i * 24 + 12},${y + 18} ${i * 24 + 4},${y + 12}`}
              fill={c1}
            />
          ))}
        </g>
      );
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "pin",
              9,
              9,
              <rect width={1.2} height={9} fill={c1} opacity={0.16} />,
            )}
          </defs>
          {fill("pin")}
          {band(56)}
          {band(420)}
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <circle cx={200} cy={120 + i * 32} r={5} fill={c1} />
              <ellipse
                cx={188}
                cy={120 + i * 32}
                rx={7}
                ry={2.6}
                fill={c2}
                transform={`rotate(-25 188 ${120 + i * 32})`}
              />
              <ellipse
                cx={212}
                cy={120 + i * 32}
                rx={7}
                ry={2.6}
                fill={c2}
                transform={`rotate(25 212 ${120 + i * 32})`}
              />
            </g>
          ))}
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
    case "damask": {
      body = (
        <>
          {ground}
          <defs>
            {tile(
              "dm",
              110,
              140,
              <>
                <path
                  d="M55 8 C84 34 84 56 55 72 C26 56 26 34 55 8Z"
                  fill={c1}
                  opacity={0.5}
                />
                <path
                  d="M55 132 C84 106 84 84 55 68 C26 84 26 106 55 132Z"
                  fill={c1}
                  opacity={0.32}
                />
                <path
                  d="M55 22 C68 38 68 50 55 60 C42 50 42 38 55 22Z"
                  fill={c0}
                  opacity={0.55}
                />
                <circle cx={55} cy={70} r={6} fill={c2} opacity={0.8} />
                <circle cx={0} cy={70} r={11} fill={c1} opacity={0.4} />
                <circle cx={110} cy={70} r={11} fill={c1} opacity={0.4} />
                <circle cx={0} cy={0} r={6} fill={c1} opacity={0.35} />
                <circle cx={110} cy={0} r={6} fill={c1} opacity={0.35} />
              </>,
            )}
          </defs>
          {fill("dm")}
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
    case "kente": {
      const O = "#F26B1D",
        R = "#C8202A",
        G = "#1F8A3B",
        K = "#15100E",
        DG = "#0F4D24",
        CREAM = "#F6E3B4";
      const k = 2; // overall scale
      const Z = 0.5; // zoom-out: lower = more fabric visible
      const GAP = 5; // cream line between panels (was 3, raised so it stays visible when scaled down)
      // const k = 2; // overall scale
      // const GAP = 3; // cream line between panels
      const colW = [56, 70, 56, 64, 60, 60].map((v) => v * k);
      const TW = colW.reduce((a, b) => a + b, 0);
      const hA = 70 * k,
        hB = 105 * k;
      const TH = hA + hB + GAP * 2;
      const bandA = ["vstripe", "tri", "vstripe", "tri", "vstripe", "tri"];
      const bandB = [
        "diamond",
        "weave",
        "diamond",
        "check",
        "diamond",
        "weave",
      ];

      const stair = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
        n: number,
        right: boolean,
        down: boolean,
        fill: string,
      ) => {
        const out: ReactNode[] = [];
        for (let i = 0; i < n; i++) {
          const sw = (w * (i + 1)) / n;
          const sy = down ? y + (i * h) / n : y + h - ((i + 1) * h) / n;
          out.push(
            <rect
              key={i}
              x={right ? x + w - sw : x}
              y={sy}
              width={sw}
              height={h / n + 0.5}
              fill={fill}
            />,
          );
        }
        return <g key={key}>{out}</g>;
      };

      const vstripe = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
      ) => {
        const seq: [string, number][] = [
          [R, 2],
          [O, 3],
          [G, 2],
          [K, 2],
          [O, 2],
          [R, 2],
          [G, 3],
          [O, 2],
          [K, 2],
          [R, 2],
          [O, 3],
          [G, 2],
          [R, 2],
          [O, 2],
        ];
        const tot = seq.reduce((a, s) => a + s[1], 0);
        let xx = x;
        return (
          <g key={key}>
            <rect x={x} y={y} width={w} height={h} fill={O} />
            {seq.map(([col, sw], i) => {
              const cw = (sw / tot) * w;
              const r = (
                <rect
                  key={i}
                  x={xx}
                  y={y}
                  width={cw + 0.5}
                  height={h}
                  fill={col}
                />
              );
              xx += cw;
              return r;
            })}
            <rect x={x} y={y} width={w} height={h} fill="url(#kn-ticks)" />
          </g>
        );
      };

      const tri = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
        flip: boolean,
      ) => {
        const sw = w * 0.32;
        return (
          <g key={key}>
            <rect x={x} y={y} width={w} height={h} fill={O} />
            {/* fine striped strip on one side */}
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={flip ? x + w - sw + i * (sw / 4) : x + i * (sw / 4)}
                y={y}
                width={sw / 8}
                height={h}
                fill={i % 2 ? R : G}
              />
            ))}
            {stair(
              `${key}g`,
              flip ? x : x + sw,
              y,
              w - sw,
              h * 0.5,
              6,
              flip,
              true,
              G,
            )}
            {stair(
              `${key}k`,
              flip ? x : x + sw,
              y + h * 0.5,
              w - sw,
              h * 0.5,
              6,
              !flip,
              false,
              K,
            )}
            <rect x={x} y={y} width={w} height={h} fill="url(#kn-ticks)" />
          </g>
        );
      };

      const diamond = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
      ) => {
        const cols = 3,
          cw = w / cols,
          dh = h / 3;
        const out: ReactNode[] = [
          <rect key="bg" x={x} y={y} width={w} height={h} fill={O} />,
        ];
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < 3; r++) {
            const cx = x + c * cw + cw / 2,
              y0 = y + r * dh;
            const P = (s: number) =>
              `${cx},${y0 + dh / 2 - (dh / 2) * s} ${cx + cw * 0.45 * s},${y0 + dh / 2} ${cx},${y0 + dh / 2 + (dh / 2) * s} ${cx - cw * 0.45 * s},${y0 + dh / 2}`;
            out.push(
              <polygon
                key={`d${c}${r}`}
                points={P(1)}
                fill={[K, DG, R][(c + r) % 3]}
              />,
            );
            out.push(<polygon key={`i${c}${r}`} points={P(0.5)} fill={O} />);
          }
        }
        return <g key={key}>{out}</g>;
      };

      const weave = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
      ) => {
        const rows: [string, number][] = [
          [O, 4],
          [G, 5],
          [R, 3],
          [K, 5],
          [O, 3],
          [G, 5],
          [R, 4],
          [O, 3],
          [K, 4],
          [G, 5],
          [R, 3],
          [O, 4],
          [G, 5],
          [K, 3],
        ];
        const tot = rows.reduce((a, r) => a + r[1], 0);
        let yy = y;
        return (
          <g key={key}>
            {rows.map(([col, rh], i) => {
              const hh = (rh / tot) * h;
              const r = (
                <g key={i}>
                  <rect x={x} y={yy} width={w} height={hh + 0.5} fill={col} />
                  {col !== O && (
                    <rect
                      x={x}
                      y={yy}
                      width={w}
                      height={hh}
                      fill="none"
                      stroke={O}
                      strokeWidth={hh * 0.6}
                      strokeDasharray="2 4"
                      opacity={0.6}
                    />
                  )}
                </g>
              );
              yy += hh;
              return r;
            })}
          </g>
        );
      };

      const check = (
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
      ) => (
        <g key={key}>
          <rect x={x} y={y} width={w} height={h} fill={O} />
          <rect x={x} y={y} width={w} height={h} fill="url(#kn-plaid)" />
        </g>
      );

      const draw = (
        type: string,
        key: string,
        x: number,
        y: number,
        w: number,
        h: number,
        i: number,
      ) =>
        type === "vstripe"
          ? vstripe(key, x, y, w, h)
          : type === "tri"
            ? tri(key, x, y, w, h, i % 2 === 1)
            : type === "diamond"
              ? diamond(key, x, y, w, h)
              : type === "weave"
                ? weave(key, x, y, w, h)
                : check(key, x, y, w, h);

      const parts: ReactNode[] = [];
      // for (let ty = 0, r = 0; ty < H; ty += TH, r++) {
      //   for (let tx = 0, t = 0; tx < W; tx += TW, t++) {
      for (let ty = 0, r = 0; ty < H / Z; ty += TH, r++) {
        for (let tx = 0, t = 0; tx < W / Z; tx += TW, t++) {
          let xx = tx;
          colW.forEach((cw, i) => {
            parts.push(
              draw(bandA[i], `a${r}-${t}-${i}`, xx, ty, cw - GAP, hA, i + r),
            );
            parts.push(
              draw(
                bandB[i],
                `b${r}-${t}-${i}`,
                xx,
                ty + hA + GAP,
                cw - GAP,
                hB,
                i,
              ),
            );
            xx += cw;
          });
        }
      }

      body = (
        <>
          <defs>
            <pattern
              id="kn-ticks"
              width="4"
              height="3"
              patternUnits="userSpaceOnUse"
            >
              <rect width="4" height="1" fill={O} opacity="0.45" />
            </pattern>
            <pattern
              id="kn-plaid"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <rect width="3.5" height="7" fill={R} opacity="0.9" />
              <rect width="7" height="3.5" fill={R} opacity="0.7" />
              <rect
                x="3.5"
                y="3.5"
                width="2"
                height="2"
                fill={K}
                opacity="0.8"
              />
            </pattern>
          </defs>
          {/* <rect width={W} height={H} fill={CREAM} />
          {parts} */}
          <rect width={W} height={H} fill={CREAM} />
          <g transform={`scale(${Z})`}>{parts}</g>
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
