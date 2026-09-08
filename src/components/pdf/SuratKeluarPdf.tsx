import {
  Document,
  Page,
  View,
  Text,
  Image,
  type DocumentProps,
} from "@react-pdf/renderer";
import { createTw } from "@react-pdf/tailwind";
import type { ReactElement } from "react";

const tw = createTw({
  fontFamily: {
    sans: ["Papyrus"],
  },
  colors: {
    custom: "#000000",
  },
});

const MARGIN_HORIZONTAL = 56.69;

interface TtdItem {
  urut: number;
  id_ttd: string;
  ttd_name: string;
  ket: string;
  oto: number;
  ttd_image: string | null;
}

interface LokasiData {
  wil_code: string;
  wil_ket: string;
  kode: string;
  kota: string;
  alamat: string;
  telp: string;
}

interface SuratData {
  id_surat: number;
  no_surat: string;
  perihal: string;
  wil_kirim: string;
  kota: string;
  tgl_kirim: string;
  kepada: string;
  kepada2: string;
  id_kirim: string;
  isi: string;
  klasifikasi: string;
  stat_oto: string;
  lampiran: number;
  ket_lampiran?: string;
  urut: number;
  id_ttd: string;
  nm_pengirim: string;
  oto: number;
  ttd_name: string;
  ttd_image: string | null;
  ket: string;
  tembusan_ket: string;
  ttd: TtdItem[];
  jumlahTtd: number;
  showSignatureHeader: boolean;
  isSingleSignature: boolean;
  lampiranValue: number;
  showLampiran: boolean;
  logo: string;
  footer: string;
  kepadaList: string[];
  kepadaSatu: boolean;
  lokasi: LokasiData;
}

interface SuratKeluarPdfProps {
  data: SuratData;
}

type IsiBlock =
  | {
      type: "paragraph";
      text: string;
      bold: boolean;
      italic: boolean;
    }
  | {
      type: "list";
      items: string[];
    };

const bulanIndonesia = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggal(iso: string) {
  const date = new Date(iso);
  const hari = date.getDate();
  const bulan = bulanIndonesia[date.getMonth()];
  const tahun = date.getFullYear();

  return `${hari} ${bulan} ${tahun}`;
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, "")).trim();
}

function parseIsi(html: string): IsiBlock[] {
  const blocks: IsiBlock[] = [];
  const seenParagraphs = new Set<string>();
  const seenLists = new Set<string>();

  const regex = /<p[^>]*>([\s\S]*?)<\/p>|<ol[^>]*>([\s\S]*?)<\/ol>/g;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match[1] !== undefined) {
      const rawText = match[1];
      const text = stripTags(rawText);

      if (!text || seenParagraphs.has(text)) {
        continue;
      }

      seenParagraphs.add(text);

      blocks.push({
        type: "paragraph",
        text,
        bold: /<strong>/i.test(rawText),
        italic: /<em>/i.test(rawText),
      });
    } else if (match[2] !== undefined) {
      const rawList = match[2];
      const key = stripTags(rawList);

      if (seenLists.has(key)) {
        continue;
      }

      seenLists.add(key);

      const items: string[] = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;

      let liMatch: RegExpExecArray | null;

      while ((liMatch = liRegex.exec(rawList)) !== null) {
        const itemText = stripTags(liMatch[1]);

        if (itemText) {
          items.push(itemText);
        }
      }

      if (items.length > 0) {
        blocks.push({
          type: "list",
          items,
        });
      }
    }
  }

  return blocks;
}

function splitByComma(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getKepadaList(data: SuratData) {
  if (data.kepadaList?.length) {
    return data.kepadaList.flatMap((item) => splitByComma(item));
  }

  return splitByComma(data.kepada);
}

function getTembusanList(value: string) {
  return splitByComma(value);
}

export default function SuratKeluarPdf({
  data,
}: SuratKeluarPdfProps): ReactElement<DocumentProps> {
  const isiBlocks = parseIsi(data.isi);
  const kepadaList = getKepadaList(data);
  const tembusanList = getTembusanList(data.tembusan_ket);

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={[
          tw("pt-12 pb-24 text-[10px] text-custom"),
          {
            paddingLeft: MARGIN_HORIZONTAL,
            paddingRight: MARGIN_HORIZONTAL,
          },
        ]}
      >
        <View>
          {data.logo ? (
            <Image src={data.logo} style={tw("w-40")} />
          ) : (
            <View style={tw("w-32")} />
          )}
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              marginLeft: "auto",
              alignItems: "flex-end",
            }}
          >
            <Text style={tw("mt-2")}>
              {data.lokasi.kota}, {formatTanggal(data.tgl_kirim)}
            </Text>
          </View>
        </View>

        <View style={tw("mb-3")}>
          <View style={tw("w-full")}>
            <View style={tw("flex flex-row mb-1")}>
              <Text style={tw("w-16")}>Nomor</Text>
              <Text style={tw("mr-1")}>:</Text>
              <Text style={tw("flex-1")}>{data.no_surat}</Text>
            </View>

            <View style={tw("flex flex-row mb-1")}>
              <Text style={tw("w-16")}>Hal</Text>
              <Text style={tw("mr-1")}>:</Text>
              <Text style={tw("font-bold underline flex-1")}>
                {data.perihal}
              </Text>
            </View>

            {data.showLampiran && (
              <View style={tw("flex flex-row mb-1")}>
                <Text style={tw("w-16")}>Lamp.</Text>
                <Text style={tw("mr-1")}>:</Text>
                <Text style={tw("flex-1")}>
                  {data.lampiranValue} {data.ket_lampiran ?? ""}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginBottom: 4,
                textAlign: "right",
              }}
            >
              Kepada, Yth.
            </Text>

            {kepadaList.map((nama, index) => (
              <Text
                key={index}
                style={{
                  marginBottom: 4,
                  textAlign: "right",
                }}
              >
                {nama}
              </Text>
            ))}

            {data.kepada2
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, index) => (
                <Text
                  key={index}
                  style={{
                    marginBottom: 4,
                    textAlign: "right",
                  }}
                >
                  {line}
                </Text>
              ))}
          </View>
        </View>

        <Text style={tw("italic mb-4")}>Assalamu'alaikum, Wr. Wb.</Text>

        {isiBlocks.map((block, index) => {
          if (block.type === "paragraph") {
            const styleClasses = [
              "text-justify",
              "mb-4",
              block.bold ? "font-bold" : "",
              block.italic ? "italic" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Text key={index} style={tw(styleClasses)}>
                {block.text}
              </Text>
            );
          }

          return (
            <View key={index} style={tw("mb-4")}>
              {block.items.map((item, itemIndex) => (
                <View key={itemIndex} style={tw("flex flex-row mb-2")}>
                  <Text style={tw("w-4")}>{itemIndex + 1}.</Text>
                  <Text style={tw("flex-1 text-justify")}>{item}</Text>
                </View>
              ))}
            </View>
          );
        })}

        <Text style={tw("italic mb-8")}>Wassalamu'alaikum, Wr. Wb.</Text>

        {data.showSignatureHeader && (
          <View style={tw("items-center mb-12")}>
            <Text>Koperasi Simpan Pinjam dan Pembiayaan Syariah</Text>
            <Text>Kospin JASA Syariah</Text>
          </View>
        )}

        <View style={tw("flex flex-row justify-between mb-8")} wrap={false}>
          {data.ttd.map((item) => (
            <View key={item.id_ttd} style={tw("items-center w-1/3 px-2")}>
              <Text style={tw("font-bold underline mb-1")}>
                {item.ttd_name}
              </Text>

              <Text style={tw("text-center")}>{item.ket}</Text>
            </View>
          ))}
        </View>

        {tembusanList.length > 0 && (
          <View style={tw("mb-8")}>
            <Text style={tw("italic underline mb-1")}>Tembusan:</Text>

            {tembusanList.map((item, index) => (
              <Text key={index} style={tw("italic mb-1")}>
                - {item}
              </Text>
            ))}
          </View>
        )}

        <View style={tw("absolute bottom-0 left-0 right-0")} fixed>
          <View style={tw("flex flex-row justify-between px-12 pb-2")}>
            <View>
              <Text style={tw("font-bold text-sm")}>
                KSPPS KOSPIN JASA {data.lokasi.wil_ket}
              </Text>

              <Text style={tw("text-sm")}>{data.lokasi.alamat}</Text>

              <Text style={tw("text-sm")}>Telp. {data.lokasi.telp}</Text>
            </View>

            <View style={tw("items-end")}>
              <Text style={tw("font-bold text-sm")}>Klasifikasi Dokumen:</Text>

              <Text style={tw("text-sm")}>{data.klasifikasi}</Text>
            </View>
          </View>

          {data.footer ? (
            <Image src={data.footer} style={tw("w-full")} />
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
