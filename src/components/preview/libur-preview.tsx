import { cn } from "@/lib/utils";
import type { PengumumanLiburFormData } from "@/types/libur";
import type { ComboboxOption } from "../form/combobox-field";
import { useEffect, useRef, useState } from "react";
import { A4Page } from "../a4";
import { DocumentFooter } from "./skeluar-preview";
import type { Lokasi } from "@/types/lokasi";
import { toast } from "sonner";
import { getLokasi } from "@/lib/param";
import { usePageTitle } from "@/lib/use-page-title";

type Props = {
  data: PengumumanLiburFormData;
  className?: string;
  visible?: boolean;
  klasifikasiOptions?: ComboboxOption[];
};

const bodyContentClass =
  "surat-body-content prose prose-sm max-w-none break-words text-justify surat-preview-content";

export function HariLiburPreview({
  data,
  className,
  visible,
  klasifikasiOptions = [],
}: Props) {
  usePageTitle("Preview Pengumuman Libur");
  const libur = data;
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [pages] = useState<string[]>([""]);
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);

  const nomorSurat = [
    libur?.xNo_bag,
    libur?.xNo_kode,
    "Kspps.Js",
    libur?.xNo_bln,
    libur?.xNo_thn ? new Date(libur.xNo_thn).getFullYear() : undefined,
  ]
    .filter(Boolean)
    .join("/");

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const data = await getLokasi();
        setLokasi(data as Lokasi[]);
      } catch {
        toast.error("Gagal mengambil data lokasi");
      }
    };

    fetchLokasi();
  }, []);

  const lokasiSurat = lokasi.find((item) => item.wil_code === "9000") ?? null;

  const jnsKlasifikasi =
    klasifikasiOptions.find((item) => item.value === libur.klasifikasi)
      ?.label ??
    libur?.klasifikasi ??
    ".....................";

  const formatTanggal = (value?: Date | string) => {
    if (!value) return ".....................";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return ".....................";
    }

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTanggalTtd = (value?: Date | string) => {
    if (!value) return ".....................";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return ".....................";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

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
          {pages.map((_, index) => (
            <A4Page
              key={index}
              footer={
                <DocumentFooter
                  jnsKlasifikasi={jnsKlasifikasi}
                  xTg_share={libur?.xTg_share}
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
                      className="h-[25mm] w-[55mm] object-contain"
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl underline">PENGUMUMAN</h2>

                    <p>{nomorSurat || "......................."}</p>
                  </div>

                  <div className={bodyContentClass}>
                    <p className="mt-5">Dengan ini diumumkan bahwa pada:</p>

                    <div className="my-3 text-xl">
                      {libur.tglLibur.length > 0 ? (
                        <div className="space-y-1">
                          {libur.tglLibur.map((item, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="w-7">{i + 1}.</span>

                              <div>
                                <span className="font-semibold">
                                  {formatTanggal(item.tglLibur)}
                                </span>

                                {item.keterangan && (
                                  <span> ({item.keterangan})</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>.....................</p>
                      )}
                    </div>

                    <div className="w-full">
                      <p className="font-bold text-justify">
                        KANTOR KSPPS KOSPIN JASA SYARIAH{" "}
                        <span className="text-xl">
                          <u>TUTUP</u>
                        </span>
                      </p>

                      <p className="font-bold text-justify">
                        Buka kembali{" "}
                        <strong className="text-xl underline">
                          {formatTanggal(libur.buka)}
                        </strong>
                      </p>
                    </div>

                    <p className="flex justify-center items-center mt-3">
                      Demikian agar menjadikan maklum
                    </p>

                    <div className="mt-3 flex justify-center">
                      <div className="w-[70mm] text-center">
                        <p>
                          {"Pekalongan"}, {formatTanggalTtd(libur.xNo_thn)}
                        </p>
                        <p className="mt-2">KSPPS Kospin Jasa Syariah</p>
                        {libur.ttd.length > 0 ? (
                          libur.ttd.map((item, i) => (
                            <div key={i} className="mt-2">
                              <div className="h-[20mm]" />

                              <p className="font-semibold underline">
                                {item.label}
                              </p>
                              <p>{item.jabatan}</p>
                            </div>
                          ))
                        ) : (
                          <>
                            <p className="mt-2">KSPPS Kospin Jasa Syariah</p>

                            <div className="h-[30mm]" />

                            <p className="font-semibold underline">
                              .....................
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </A4Page>
          ))}
        </div>
      </div>
    </>
  );
}
