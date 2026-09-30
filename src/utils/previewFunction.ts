function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatTanggalIndo(date?: Date | string | null) {
  if (!date) {
    return ".....................";
  }

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return ".....................";
  }

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getNama(item: unknown): string {
  if (!item) {
    return ".....................";
  }

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object") {
    if ("nama" in item) {
      return (item as { nama?: string }).nama || ".....................";
    }

    if ("Xpenerima" in item) {
      return (
        (item as { Xpenerima?: string }).Xpenerima || "....................."
      );
    }

    if ("xTipe_penerimaValue" in item) {
      return (
        (
          item as {
            xTipe_penerimaValue?: string;
          }
        ).xTipe_penerimaValue || "....................."
      );
    }
  }

  return ".....................";
}

export function getTembusan(item: unknown) {
  if (!item) {
    return "................";
  }

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object") {
    if ("tembusan_ket" in item) {
      return (
        (
          item as {
            tembusan_ket?: string;
          }
        ).tembusan_ket || "....................."
      );
    }

    return ".....................";
  }

  return ".....................";
}

export function splitTextByLength(text: string, maxLength = 40) {
  if (!text) {
    return ["....................."];
  }

  const lines: string[] = [];

  for (let i = 0; i < text.length; i += maxLength) {
    lines.push(text.slice(i, i + maxLength));
  }

  return lines;
}

export function angkaIndo(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const angka = Number(value);

  if (!Number.isFinite(angka)) {
    return String(value);
  }

  const satuan = [
    "Nol",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (angka < 12) {
    return satuan[angka];
  }

  if (angka < 20) {
    return `${satuan[angka - 10]} belas`;
  }

  if (angka < 100) {
    return `${satuan[Math.floor(angka / 10)]} puluh${
      angka % 10 ? ` ${satuan[angka % 10]}` : ""
    }`;
  }

  if (angka < 200) {
    return `seratus${angka % 100 ? ` ${angkaIndo(angka % 100)}` : ""}`;
  }

  if (angka < 1000) {
    return `${satuan[Math.floor(angka / 100)]} ratus${
      angka % 100 ? ` ${angkaIndo(angka % 100)}` : ""
    }`;
  }

  return String(value);
}

export function buildSignatureHtml(ttd: any[]): string {
  const wassalam = `<p class="mt-3 mb-8 text-left italic">Wassalamu'alaikum, Wr.Wb.</p>`;

  if (!ttd || ttd.length === 0) {
    return wassalam;
  }

  const heading =
    ttd.length >= 2
      ? `<p class="text-center">Koperasi Simpan Pinjam dan Pembiayaan Syariah</p><p class="mb-16 text-center">Kospin JASA Syariah</p>`
      : "";

  const rowClass =
    ttd.length >= 2
      ? "flex w-full text-center justify-between"
      : "flex w-full text-center justify-end";

  const items = ttd
    .map((t: any) => {
      const label = escapeHtml(t?.label ?? ".....................");
      const jabatan = escapeHtml(t?.jabatan ?? ".....................");

      if (ttd.length === 1) {
        return `
          <div class="text-center w-[95mm] min-w-[95mm]">
            <p class="mb-16 mr-[5mm] text-left">
              KSPPS Kospin JASA Syariah
            </p>

            <p class="mr-[15mm] font-bold underline text-left">
              ${label}
            </p>

            <span class="ml-[-65mm] text-xs text-left">
              ${jabatan}
            </span>
          </div>
        `;
      }

      return `
        <div class="text-center">
          <div class="inline-block text-center">
            <p class="font-bold underline">
              ${label}
            </p>

            <p class="text-xs">
              ${jabatan}
            </p>
          </div>
        </div>
      `;
    })
    .join("");

  return `${wassalam}<div class="mb-8">${heading}<div class="${rowClass}">${items}</div></div>`;
}

export function buildTembusanHtml(tembusan: any[]): string {
  if (!tembusan || tembusan.length === 0) {
    return "";
  }

  const items = tembusan
    .map(
      (t: any) => `
        <div style="
          margin: 0;
          padding: 0;
          font-size: 12px;
          font-style: italic;
          line-height: 1.5;
        ">
          - ${escapeHtml(getTembusan(t) ?? "")}
        </div>
      `,
    )
    .join("");

  return `
    <div style="
      position: relative;
      left: -15mm;
      width: calc(100% + 15mm);
      margin-top: 16px;
      text-align: left;
      font-size: 12px;
      font-style: italic;
    ">
      <div style="
        margin: 0 0 4px 0;
        padding: 0;
        text-decoration: underline;
      ">
        Tembusan:
      </div>

      <div style="
        margin: 0;
        padding: 0;
      ">
        ${items}
      </div>
    </div>
  `;
}

export function preloadImages(html: string): Promise<void> {
  if (!html) {
    return Promise.resolve();
  }

  const container = document.createElement("div");

  container.innerHTML = html;

  const imgs = Array.from(container.querySelectorAll("img"));

  if (imgs.length === 0) {
    return Promise.resolve();
  }

  const loaders = imgs.map(
    (img) =>
      new Promise<void>((resolve) => {
        const src = img.getAttribute("src");

        if (!src) {
          resolve();
          return;
        }

        const loader = new Image();

        loader.onload = () => resolve();
        loader.onerror = () => resolve();
        loader.src = src;
      }),
  );

  return Promise.all(loaders).then(() => undefined);
}

export function measureHtml(
  html: string,
  width = "300mm",
): {
  height: number;
  element: HTMLDivElement;
} {
  const temp = document.createElement("div");

  temp.style.position = "absolute";
  temp.style.left = "-99999px";
  temp.style.top = "0";
  temp.style.width = width;
  temp.style.visibility = "hidden";
  temp.style.pointerEvents = "none";
  temp.style.overflowWrap = "anywhere";
  temp.style.wordBreak = "break-word";
  temp.style.boxSizing = "border-box";

  temp.className =
    "prose prose-sm max-w-none text-justify surat-preview-content";

  temp.innerHTML = html;

  document.body.appendChild(temp);

  const height = temp.scrollHeight;

  temp.remove();

  return {
    height,
    element: temp,
  };
}

export function createTextSplit(
  element: HTMLElement,
  text: string,
  maxHeight: number,
  currentHtml: string,
) {
  if (!text.trim()) {
    return {
      first: "",
      rest: "",
    };
  }

  let low = 1;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    const firstElement = element.cloneNode(false) as HTMLElement;

    firstElement.style.overflowWrap = "anywhere";
    firstElement.style.wordBreak = "break-word";
    firstElement.textContent = text.slice(0, mid);

    const measured = measureHtml(currentHtml + firstElement.outerHTML);

    if (measured.height <= maxHeight) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    measured.element.remove();
  }

  if (best <= 0) {
    return {
      first: "",
      rest: text,
    };
  }

  let splitAt = best;

  const candidate = text.slice(0, best);

  const lastSpace = candidate.lastIndexOf(" ");

  if (lastSpace > 0 && lastSpace > best * 0.65) {
    splitAt = lastSpace;
  }

  const firstText = text.slice(0, splitAt).trimEnd();

  const restText = text.slice(splitAt).trimStart();

  const firstElement = element.cloneNode(false) as HTMLElement;

  firstElement.style.overflowWrap = "anywhere";
  firstElement.style.wordBreak = "break-word";
  firstElement.textContent = firstText;

  const restElement = element.cloneNode(false) as HTMLElement;

  restElement.style.overflowWrap = "anywhere";
  restElement.style.wordBreak = "break-word";
  restElement.textContent = restText;

  return {
    first: firstText ? firstElement.outerHTML : "",
    rest: restText ? restElement.outerHTML : "",
  };
}

export function splitLongTextElement(
  element: HTMLElement,
  maxHeight: number,
  currentHtml: string,
) {
  const text = element.textContent ?? "";

  return createTextSplit(element, text, maxHeight, currentHtml);
}

export function splitHtmlByHeight(
  html: string,
  maxHeightFirst: number,
  maxHeightRest: number = maxHeightFirst,
): string[] {
  if (!html?.trim()) {
    return ["<p>.....................</p>"];
  }

  const container = document.createElement("div");

  container.innerHTML = html;

  const pages: string[] = [];
  let current = "";

  const children = Array.from(container.children) as HTMLElement[];

  const maxHeightFor = (pageIndex: number) =>
    pageIndex === 0 ? maxHeightFirst : maxHeightRest;

  for (const originalChild of children) {
    let remainingHtml = originalChild.outerHTML;

    while (remainingHtml) {
      const maxHeight = maxHeightFor(pages.length);

      const candidate = current + remainingHtml;

      const measured = measureHtml(candidate);

      if (measured.height <= maxHeight) {
        measured.element.remove();

        current = candidate;
        remainingHtml = "";

        continue;
      }

      measured.element.remove();

      const currentHeight = current ? measureHtml(current) : null;

      const usedHeight = currentHeight?.height ?? 0;

      currentHeight?.element.remove();

      const availableHeight = maxHeight - usedHeight;

      if (availableHeight > 20) {
        const temp = document.createElement("div");

        temp.innerHTML = remainingHtml;

        const element = temp.firstElementChild as HTMLElement | null;

        if (element) {
          const result = splitLongTextElement(
            element,
            availableHeight,
            current,
          );

          if (result.first) {
            current += result.first;
            remainingHtml = result.rest;

            if (remainingHtml) {
              pages.push(current);
              current = "";
            }

            continue;
          }
        }
      }

      if (current) {
        pages.push(current);
        current = "";
        continue;
      }

      const temp = document.createElement("div");

      temp.innerHTML = remainingHtml;

      const element = temp.firstElementChild as HTMLElement | null;

      if (!element) {
        remainingHtml = "";
        continue;
      }

      const result = splitLongTextElement(
        element,
        maxHeightFor(pages.length),
        "",
      );

      if (result.first) {
        pages.push(result.first);
      }

      remainingHtml = result.rest || "";
    }
  }

  if (current) {
    pages.push(current);
  }

  return pages.length ? pages : [html];
}

export function getPageHeight() {
  const root = document.documentElement;

  const mmToPx =
    root.getBoundingClientRect().width > 0 ? 96 / 25.4 : 3.779527559;

  const pageHeightMm = 279.4;

  const topPadding = 20 * mmToPx;
  const bottomPadding = 5 * mmToPx;

  const footerImage = document.querySelector(
    ".a4-page > div:last-child img",
  ) as HTMLImageElement | null;

  const footerImageHeight = footerImage?.getBoundingClientRect().height || 40;

  const footerTextEl = document.querySelector(
    "[data-surat-footer-measure='true']",
  ) as HTMLElement | null;

  const documentFooterHeight =
    footerTextEl?.getBoundingClientRect().height || 35;

  return (
    pageHeightMm * mmToPx -
    topPadding -
    bottomPadding -
    footerImageHeight -
    documentFooterHeight -
    8
  );
}

export async function paginateContent(
  xIsi: string,
  ttd: any[],
  tembusan: any[],
  headerHeight = 0,
  safetyMargin = 0,
): Promise<string[]> {
  const introHtml =
    `<p class="mb-4 text-left italic">Assalamu'alaikum, Wr. Wb.</p>` +
    `<p class="mb-2 text-justify text-base" style="overflow-wrap:anywhere;word-break:break-word;">Teriring Salam dan Do'a, Semoga kita semua Senantiasa diberi Kesehatan, Limpahan Rahmat dan Barokah dari Allah Subhanahu Wa Ta'ala dalam menjalankan aktifitas sehari-hari, Amiin.</p>`;

  const closingHtml = buildSignatureHtml(ttd) + buildTembusanHtml(tembusan);

  const fullHtml = introHtml + (xIsi || "") + closingHtml;

  await preloadImages(fullHtml);

  const pageHeight = getPageHeight();

  const normalHeight = Math.max(900, Math.floor(pageHeight)) - safetyMargin;

  const firstPageHeight = Math.max(300, normalHeight - headerHeight);

  return splitHtmlByHeight(fullHtml, firstPageHeight, normalHeight);
}
