export class UploadAdapter {
  private loader: any
  private uploadUrl: string

  constructor(loader: any, uploadUrl: string) {
    this.loader = loader
    this.uploadUrl = uploadUrl
  }

  async upload() {
    const file = await this.loader.file
    const formData = new FormData()
    formData.append("upload", file)

    const response = await fetch(this.uploadUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Gagal mengupload gambar")
    }

    const data = await response.json()

    return {
      default: data.url as string,
    }
  }

  abort() {
    // no-op, tidak ada request yang bisa dibatalkan pada implementasi ini
  }
}

export function createUploadAdapterPlugin(uploadUrl: string) {
  return function UploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader, uploadUrl)
    }
  }
}

function extractFileName(url?: string) {
  if (!url) return null

  try {
    return new URL(url).pathname.split("/").pop() ?? null
  } catch {
    return url.split("/").pop() ?? null
  }
}

export function createImageDeletePlugin(deleteUrl: string) {
  return function ImageDeletePlugin(editor: any) {
    let previousImages = new Set<string>()

    editor.model.document.on("change", () => {
      const currentImages = new Set<string>()

      editor.model.document
        .getRoot()
        .getChildren()
        .forEach((node: any) => {
          if (node.name === "imageBlock" || node.name === "imageInline") {
            const src = node.getAttribute("src")
            if (src) currentImages.add(src)
          }
        })

      previousImages.forEach((src) => {
        if (!currentImages.has(src)) {
          const fileName = extractFileName(src)

          if (fileName) {
            fetch(`${deleteUrl}/${fileName}`, { method: "DELETE" }).catch((error) => {
              console.error("Gagal hapus gambar:", error)
            })
          }
        }
      })

      previousImages = currentImages
    })
  }
}
