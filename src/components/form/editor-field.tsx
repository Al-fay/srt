import { useEffect, useRef } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { CKEditor } from "ckeditor4-react";
import { getErrorMessage } from "@/lib/form-errors";
import { api } from "@/lib/api";
import { FieldError } from "../ui/field";
import { API_URL } from "@/lib/env";

type Props = {
  field: AnyFieldApi;
};

type UploadedImage = {
  url: string;
  path: string;
};

export function EditorField({ field }: Props) {
  const editorRef = useRef<any>(null);
  const uploadedImagesRef = useRef<Map<string, UploadedImage>>(new Map());
  const deletedImagesRef = useRef<Set<string>>(new Set());
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBaseUrl = () => {
    return API_URL.replace(/\/api\/?$/, "");
  };

  const getFileUrl = (path: string) => {
    const cleanPath = String(path || "").replace(/^\/+/, "");
    return `${getBaseUrl()}/api/surat/files/${cleanPath}`;
  };

  const syncDarkMode = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const isDark = document.documentElement.classList.contains("dark");

    try {
      if (editor.document) {
        const body = editor.document.getBody();

        if (body?.$) {
          body.$.classList.toggle("dark", isDark);
        }
      }

      const sourceTextarea = editor.container?.findOne(".cke_source");

      if (sourceTextarea?.$) {
        sourceTextarea.$.classList.toggle("dark", isDark);
      }
    } catch (error) {
      console.error("Gagal sync dark mode:", error);
    }
  };

  const getCurrentImageUrls = (editor: any): Set<string> => {
    const urls = new Set<string>();

    if (!editor?.document) {
      return urls;
    }

    try {
      const images = editor.document.find("img");

      for (let i = 0; i < images.count(); i++) {
        const image = images.getItem(i);

        const src =
          image.getAttribute("src") || image.getAttribute("data-cke-saved-src");

        if (src) {
          urls.add(src);
        }
      }
    } catch (error) {
      console.error("Gagal membaca image:", error);
    }

    return urls;
  };

  const deleteImage = async (image: UploadedImage) => {
    if (!image?.path) {
      return;
    }

    if (deletedImagesRef.current.has(image.path)) {
      return;
    }

    deletedImagesRef.current.add(image.path);

    try {
      await api("/surat/delete", {
        method: "DELETE",
        body: JSON.stringify({
          path: image.path,
        }),
      });

      uploadedImagesRef.current.delete(image.url);
    } catch (error) {
      deletedImagesRef.current.delete(image.path);

      console.error("Gagal menghapus gambar:", error);
    }
  };

  const cleanupDeletedImages = (editor: any) => {
    if (!editor) {
      return;
    }

    const currentUrls = getCurrentImageUrls(editor);

    for (const [url, image] of uploadedImagesRef.current) {
      if (!currentUrls.has(url)) {
        void deleteImage(image);
      }
    }
  };

  const scheduleCleanup = (editor: any) => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    cleanupTimeoutRef.current = setTimeout(() => {
      cleanupDeletedImages(editor);
    }, 1000);
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      syncDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();

      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  const errors = field.state.meta.errors;

  return (
    <>
      <div className="surat-editor">
        <CKEditor
          editorUrl="/ckeditor4/ckeditor.js"
          initData={field.state.value ?? ""}
          config={{
            height: 300,
            versionCheck: false,

            find_highlight: {
              element: "span",
              styles: {
                "background-color": "#ffff00",
                color: "#000000",
              },
            },

            colorButton_colors:
              "CF5D4E,454545,FFF,DDD,CCEAEE,66AB16,2a0246,dd3d38,e432cc,3532e4,32cfe4,e4326d,ffe600,00aeff,6200ff,48ff00,0099ff,001aff",

            extraPlugins:
              "justify,tableresize,uploadimage,find,colorbutton,specialchar",

            uploadUrl: `${API_URL}/surat/figure`,
            imageUploadUrl: `${API_URL}/surat/figure`,
            filebrowserImageUploadUrl: `${API_URL}/surat/figure`,

            placeholder: "Masukkan isi surat...",

            contentsCss: "/ckeditor4/ckeditor-content.css",

            format_tags: "p;h1;h2;h3;h4;h5;h6",

            toolbar: [
              {
                name: "format",
                items: ["Cut", "Copy", "Paste", "Undo", "Redo"],
              },
              {
                name: "styles",
                items: ["Format", "Font", "FontSize", "colorButton"],
              },
              {
                name: "basicstyles",
                items: [
                  "Bold",
                  "Italic",
                  "Underline",
                  "Strike",
                  "Subscript",
                  "Superscript",
                ],
              },
              {
                name: "align",
                items: [
                  "JustifyLeft",
                  "JustifyCenter",
                  "JustifyRight",
                  "JustifyBlock",
                ],
              },
              {
                name: "paragraph",
                items: [
                  "NumberedList",
                  "BulletedList",
                  "Outdent",
                  "Indent",
                  "SpecialChar",
                ],
              },
              {
                name: "colors",
                items: ["TextColor", "BGColor"],
              },
              {
                name: "insert",
                items: ["Image", "Table", "HorizontalRule", "Link", "Unlink"],
              },
              {
                name: "document",
                items: ["RemoveFormat", "CopyFormatting"],
              },
              {
                name: "Find",
                items: ["Find", "Replace"],
              },
              {
                name: "tools",
                items: ["Maximize", "Source"],
              },
            ],

            table_defaultAttributes: {
              border: "1",
            },

            enterMode: 1,
            shiftEnterMode: 2,
            pasteFromWordRemoveFontStyles: false,
            pasteFromWordRemoveStyles: false,
            allowedContent: true,
            resize_enabled: true,
            language: "en",
          }}

          onInstanceReady={(event) => {
            const editor = event.editor;

            editorRef.current = editor;

            syncDarkMode();

            editor.on("change", () => {
              scheduleCleanup(editor);
            });
          }}

          onChange={(event) => {
            field.handleChange(event.editor.getData() ?? "");
          }}

          onFileUploadRequest={(event: any) => {
            const fileLoader = event.data.fileLoader;
            const xhr = fileLoader.xhr;

            xhr.open("POST", `${API_URL}/surat/figure`, true);
            xhr.withCredentials = true;

            const formData = new FormData();

            formData.append(
              "file",
              fileLoader.file,
              fileLoader.fileName || fileLoader.file.name,
            );

            xhr.send(formData);

            event.stop();
          }}

          onFileUploadResponse={(event: any) => {
            const fileLoader = event.data.fileLoader;
            const xhr = fileLoader.xhr;

            event.stop();

            try {
              const response = JSON.parse(xhr.responseText);
              const file = response?.file;

              if (!file?.path) {
                event.data.message = "Path gambar tidak ditemukan";
                event.cancel();
                return;
              }

              const url = getFileUrl(file.path);

              uploadedImagesRef.current.set(url, {
                url,
                path: file.path,
              });

              event.data.url = url;

              event.data.fileName =
                file.fileName || file.originalName || "image";
            } catch (error) {
              console.error("Response upload invalid:", error);

              event.data.message = "Response upload tidak valid";
              event.cancel();
            }
          }}
        />
      </div>

      {errors.length > 0 && (
        <FieldError>{getErrorMessage(errors[0])}</FieldError>
      )}
    </>
  );
}
