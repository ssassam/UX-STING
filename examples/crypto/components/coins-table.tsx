"use client";
import { StarIcon } from "@ux-sting/icons";
import { IconButton } from "@ux-sting/react/button";
import { DataTable, type DataTableColumn } from "@ux-sting/react/data-table";
import { toast } from "@ux-sting/react/toast";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import { coins, formatUsd, series, stats, type Coin } from "../lib/market";
import { Change, CoinMark, Sparkline } from "./bits";

interface Row {
  rank: number;
  coin: Coin;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume: number;
}

export function CoinsTable({ pageSize = 12 }: { pageSize?: number }) {
  const [watch, setWatch] = useState<string[]>(["bitcoin", "ethereum"]);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const rows = useMemo<Row[]>(
    () =>
      [...coins]
        .sort((a, b) => b.price * b.supply - a.price * a.supply)
        .map((c, i) => ({
          rank: i + 1,
          coin: c,
          name: c.name,
          price: c.price,
          change24h: stats(c, "1D").change,
          change7d: stats(c, "1W").change,
          marketCap: c.price * c.supply,
          volume: stats(c).volume,
        })),
    [],
  );
  const columns: DataTableColumn<Row>[] = [
    {
      id: "watch",
      header: <span className="sr-only">Watchlist</span>,
      hideable: false,
      cell: (r) => {
        const on = watch.includes(r.coin.id);
        return (
          <IconButton
            size="sm"
            variant="ghost"
            aria-pressed={on}
            aria-label={on ? `Remove ${r.name} from watchlist` : `Add ${r.name} to watchlist`}
            onClick={() => {
              setWatch((w) => (on ? w.filter((x) => x !== r.coin.id) : [...w, r.coin.id]));
              toast(on ? "Removed from watchlist" : "Added to watchlist", { description: r.name });
            }}
          >
            <StarIcon className={on ? "fill-warning text-warning" : undefined} />
          </IconButton>
        );
      },
    },
    {
      id: "rank",
      header: "#",
      accessor: "rank",
      sortable: true,
      className: "tabular-nums text-muted-foreground",
    },
    {
      id: "name",
      header: "Asset",
      accessor: "name",
      sortable: true,
      hideable: false,
      cell: (r) => (
        <NextLink
          href={`/coin/${r.coin.id}`}
          className="flex items-center gap-2 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CoinMark coin={r.coin} />
          <span className="grid leading-tight">
            <span className="font-medium">{r.name}</span>
            <span className="text-xs text-muted-foreground">{r.coin.symbol}</span>
          </span>
        </NextLink>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessor: "price",
      sortable: true,
      align: "end",
      cell: (r) => <span className="tabular-nums">{formatUsd(r.price)}</span>,
    },
    {
      id: "change24h",
      header: "24h",
      accessor: "change24h",
      sortable: true,
      align: "end",
      cell: (r) => <Change value={r.change24h} />,
    },
    {
      id: "change7d",
      header: "7d",
      accessor: "change7d",
      sortable: true,
      align: "end",
      cell: (r) => <Change value={r.change7d} />,
    },
    {
      id: "marketCap",
      header: "Market cap",
      accessor: "marketCap",
      sortable: true,
      align: "end",
      cell: (r) => <span className="tabular-nums">{formatUsd(r.marketCap, true)}</span>,
    },
    {
      id: "volume",
      header: "Volume (24h)",
      accessor: "volume",
      sortable: true,
      align: "end",
      cell: (r) => <span className="tabular-nums">{formatUsd(r.volume, true)}</span>,
    },
    {
      id: "trend",
      header: "Last 7 days",
      align: "end",
      cell: (r) => (
        <span className="inline-flex justify-end">
          <Sparkline data={series(r.coin, "1W")} up={r.change7d >= 0} />
        </span>
      ),
    },
  ];
  return (
    <DataTable
      label="Cryptocurrency prices (sample data)"
      data={rows}
      columns={columns}
      getRowId={(r) => r.coin.id}
      searchable
      searchPlaceholder="Search assets"
      columnToggle
      pageSize={pageSize}
      defaultSort={{ id: "rank", direction: "asc" }}
      filter={onlyWatch ? (r) => watch.includes(r.coin.id) : undefined}
      responsive="scroll"
      toolbar={
        <IconButton
          aria-pressed={onlyWatch}
          aria-label={onlyWatch ? "Show all assets" : "Show watchlist only"}
          variant={onlyWatch ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setOnlyWatch((v) => !v)}
        >
          <StarIcon className={onlyWatch ? "fill-warning text-warning" : undefined} />
        </IconButton>
      }
    />
  );
}
