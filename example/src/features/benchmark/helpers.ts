export const SIZES = [
  { label: '1 KB', bytes: 1_024, iters: 1_000 },
  { label: '100 KB', bytes: 102_400, iters: 50 },
  { label: '1 MB', bytes: 1_048_576, iters: 5 },
] as const;

export type Run = {
  lib: string;
  ops: number;
  ms: number;
  x: number;
  fastest: boolean;
};

export type SizeRow = { label: string; runs: Run[] };

export type Group = {
  id: string;
  label: string;
  desc: string;
  rows: SizeRow[];
};

export function bench(operation: () => unknown, iters: number): number {
  for (let i = 0; i < Math.min(iters / 5, 10); i++) {
    operation();
  }

  const t0 = performance.now();

  for (let i = 0; i < iters; i++) {
    operation();
  }

  return Math.round((iters / (performance.now() - t0)) * 1000);
}

export function runGroup(
  id: string,
  label: string,
  desc: string,
  impls: { lib: string; run: (sizeIndex: number) => unknown }[]
): Group {
  const rows: SizeRow[] = SIZES.map((size, sizeIndex) => {
    const runs: Run[] = impls.map(({ lib, run }) => ({
      lib,
      ops: bench(() => run(sizeIndex), size.iters),
      ms: 0,
      x: 0,
      fastest: false,
    }));

    let maxOps = 0;
    let minOps = Infinity;

    for (const runEntry of runs) {
      if (runEntry.ops > maxOps) {
        maxOps = runEntry.ops;
      }

      if (runEntry.ops < minOps) {
        minOps = runEntry.ops;
      }
    }

    runs.forEach((runEntry) => {
      runEntry.ms = 1_000 / runEntry.ops;
      runEntry.x = runEntry.ops / minOps;
      runEntry.fastest = runEntry.ops === maxOps;
    });

    return { label: size.label, runs };
  });

  return { id, label, desc, rows };
}

export function fmtOps(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M ops/s`;
  }

  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}K ops/s`;
  }

  return `${n} ops/s`;
}

export function fmtMs(ms: number): string {
  if (ms < 0.001) {
    return '< 0.001 ms';
  }

  if (ms < 1) {
    return `${ms.toFixed(3)} ms`;
  }

  if (ms < 10) {
    return `${ms.toFixed(2)} ms`;
  }

  return `${ms.toFixed(1)} ms`;
}

export function fmtX(x: number): string {
  if (x < 1.05) {
    return '1.0×';
  }

  return `${x.toFixed(1)}×`;
}
