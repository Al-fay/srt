import type { ReactNode } from "react";

type A4PageProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function A4Page({ children, footer }: A4PageProps) {
  return (
    <div
      className="
        a4-page
        relative
        mx-auto
        mb-8
        flex
        h-[297mm]
        min-h-[297mm]
        w-[210mm]
        flex-col
        overflow-hidden
        bg-white
        text-sm
        text-black
        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        print:mb-0
        print:shadow-none
      "
    >
      <div
        className="
          min-h-0
          flex-1
          overflow-hidden
          px-[20mm]
          pt-[20mm]
          pb-[5mm]
        "
      >
        {children}
      </div>

      {footer && <div className="w-full shrink-0">{footer}</div>}

      <div className="w-full shrink-0">
        <img
          src="/footer.png"
          alt="Footer"
          className="block h-auto w-full object-fill"
        />
      </div>
    </div>
  );
}
