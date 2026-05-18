// components/logo.tsx — Specs-Engine version.

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-[34px] w-[34px] place-items-center bg-carbon font-mono text-[15px] font-bold tracking-[-0.05em] text-sand">
        R/
      </div>
      <div className="leading-none">
        <div className="font-display text-[17px] font-semibold tracking-[-0.03em] text-carbon">
          RunningGearDB
        </div>
        <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.14em] text-ink-50">
          SPECS · COMPARE · BUY
        </div>
      </div>
    </div>
  );
}
