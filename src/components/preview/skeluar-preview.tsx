import { cn } from "@/lib/utils";
import type { SuratFormData } from "@/types/surat";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { A4Page } from "../a4";
import {
  angkaIndo,
  formatTanggalIndo,
  getNama,
  paginateContent,
} from "@/utils/previewFunction";
import type { Lokasi } from "@/types/lokasi";
import { getLokasi } from "@/lib/param";
import { toast } from "sonner";

type ComboboxOptions = {
  value: string;
  label: string;
};

type Props = {
  data: SuratFormData;
  className?: string;
  visible?: boolean;
  kotaOptions?: ComboboxOptions[];
  klasifikasiOptions?: ComboboxOptions[];
};

const contentStyle: React.CSSProperties = {
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

export function DocumentFooter({
  jnsKlasifikasi,
  xTg_share,
  lokasi,
  footerRef,
}: {
  jnsKlasifikasi: string;
  xTg_share?: Date | string | null;
  lokasi?: Lokasi | null;
  footerRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={footerRef}
      data-surat-footer-measure="true"
      className="flex items-end justify-between px-[20mm] pb-[5mm]"
    >
      <div className="space-y-[1px]">
        <span className="block text-[9px] font-bold">
          KSPPS KOSPIN JASA {lokasi?.wil_ket ?? ""}
        </span>

        <span className="block text-[9px]">{lokasi?.alamat ?? "-"}</span>

        <span className="block text-[9px]">Telp. {lokasi?.Telp ?? "-"}</span>
      </div>

      <p className="text-right text-[9px] leading-tight">
        Klasifikasi Dokumen:
        <br />
        <span className="font-medium">{jnsKlasifikasi}</span>
        {xTg_share && (
          <>
            <br />
            Tanggal share: <span>{formatTanggalIndo(xTg_share)}</span>
          </>
        )}
      </p>
    </div>
  );
}

const bodyContentClass =
  "surat-body-content prose prose-sm max-w-none break-words text-justify surat-preview-content";

export function SuratKeluarPreview({
  data,
  className,
  visible = true,
  kotaOptions = [],
  klasifikasiOptions = [],
}: Props) {
  const surat = data?.surat;

  const ttd = data?.ttd ?? [];
  const kepada = surat?.xKepada ?? [];
  const tembusan = surat?.tembusan_ket ?? [];

  const [pages, setPages] = useState<string[]>([
    "<p>.....................</p>",
  ]);
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [safetyMargin, setSafetyMargin] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const pageContentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const footerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const attemptRef = useRef(0);

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const data = await getLokasi();

        setLokasi(data as Lokasi[]);
      } catch (error: any) {
        toast.error("Gagal mengambil data lokasi");
      }
    };

    fetchLokasi();
  }, []);

  useEffect(() => {
    attemptRef.current = 0;
    setSafetyMargin(0);
  }, [surat?.xIsi, ttd, tembusan]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const timer = await new Promise<string[]>((resolve) => {
        window.setTimeout(async () => {
          const result = await paginateContent(
            surat?.xIsi ?? "",
            ttd,
            tembusan,
            headerHeight,
            safetyMargin,
          );

          resolve(result);
        }, 100);
      });

      if (!cancelled) {
        setPages(timer);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [surat?.xIsi, ttd, tembusan, headerHeight, safetyMargin]);

  useLayoutEffect(() => {
    const el = headerRef.current;

    if (!el) {
      return;
    }

    const height = el.getBoundingClientRect().height;

    if (Math.abs(height - headerHeight) > 4) {
      setHeaderHeight(height);
    }
  }, [pages, headerHeight]);

  useLayoutEffect(() => {
    if (attemptRef.current >= 4) {
      return;
    }

    let overflowed = false;

    pageContentRefs.current.forEach((pageEl, index) => {
      const footerEl = footerRefs.current.get(index);

      if (!pageEl || !footerEl) {
        return;
      }

      const contentRect = pageEl.getBoundingClientRect();
      const footerRect = footerEl.getBoundingClientRect();

      if (contentRect.bottom > footerRect.top + 1) {
        overflowed = true;
      }
    });

    if (overflowed) {
      attemptRef.current += 1;
      setSafetyMargin((prev) => prev + 24);
    }
  }, [pages]);

  const halLines = (surat?.xHal ?? "").match(/.{1,40}/g) ?? [
    ".....................",
  ];

  const nomorSurat = [
    surat?.xNo_srt,
    surat?.xNo_bag,
    surat?.xNo_kode,
    "Kspps.Js",
    surat?.xNo_bln,
    surat?.xNo_thn ? new Date(surat.xNo_thn).getFullYear() : undefined,
  ]
    .filter(Boolean)
    .join("/");

  const namaKota =
    kotaOptions.find((item) => item.value === surat?.xKota)?.label ??
    surat?.xKota ??
    ".....................";

  const lokasiSurat =
    lokasi.find((item) => item.wil_code === surat?.xKota) ?? null;

  const jnsKlasifikasi =
    klasifikasiOptions.find((item) => item.value === surat?.klasifikasi)
      ?.label ??
    surat?.klasifikasi ??
    ".....................";

  if (!visible) {
    return null;
  }

  return (
    <>
      <p className="mb-3 flex justify-center text-2xl">
        Preview bersifat ilustrasi
      </p>

      <div className={cn("surat-preview-wrapper", className)}>
        <div className="surat-preview">
          {pages.map((page, index) => (
            <A4Page
              key={index}
              footer={
                <DocumentFooter
                  jnsKlasifikasi={jnsKlasifikasi}
                  xTg_share={surat?.xTg_share}
                  lokasi={lokasiSurat}
                  footerRef={(el) => {
                    if (el) {
                      footerRefs.current.set(index, el);
                    } else {
                      footerRefs.current.delete(index);
                    }
                  }}
                />
              }
            >
              {index === 0 && (
                <div ref={headerRef}>
                  <div className="mb-5 flex items-start">
                    <img
                      src="/kospinjasa.svg"
                      alt="KSPPS Kospin Jasa Syariah"
                      className="w-[55mm] h-[25mm] object-contain"
                    />
                  </div>

                  <div className="mb-6 flex justify-end">
                    <p className="text-left">
                      {namaKota}, {formatTanggalIndo(surat?.xNo_thn)}
                    </p>
                  </div>

                  <div className="mb-6 grid grid-cols-[47px_10px_1fr] gap-y-1">
                    <span>Nomor</span>
                    <span>:</span>
                    <span>{nomorSurat || "....................."}</span>

                    <span>Hal</span>
                    <span>:</span>

                    <span>
                      {halLines.map((line, i) => (
                        <span key={i} className="block font-bold underline">
                          {line}
                        </span>
                      ))}
                    </span>

                    {surat?.jumlahLampiran !== "" ? (
                      <>
                        <span>Lamp.</span>
                        <span>:</span>
                        <span>
                          {surat?.jumlahLampiran || "-"}{" "}
                          {`(${angkaIndo(surat?.jumlahLampiran)})`}{" "}
                          {surat?.ket_lampiran}
                        </span>
                      </>
                    ) : null}
                  </div>

                  <div className="mb-6 flex justify-end">
                    <div className="flex w-[90mm] flex-col">
                      <p className="text-left">Kepada, Yth.</p>

                      {kepada.length === 0 ? (
                        <p className="text-left">........</p>
                      ) : (
                        kepada.map((k, i) => (
                          <p key={i} className="text-left">
                            {getNama(k)}
                          </p>
                        ))
                      )}

                      <p className="whitespace-pre-wrap text-left">
                        {surat?.kepada2 ||
                          "KSPPS Kospin JASA Syariah\nDi\nTempat"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={(el) => {
                  if (el) {
                    pageContentRefs.current.set(index, el);
                  } else {
                    pageContentRefs.current.delete(index);
                  }
                }}
                className={bodyContentClass}
                style={contentStyle}
                dangerouslySetInnerHTML={{
                  __html: page,
                }}
              />
            </A4Page>
          ))}
        </div>
      </div>
    </>
  );
}
