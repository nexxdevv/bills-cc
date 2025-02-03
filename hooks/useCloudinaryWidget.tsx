"use client"
import { useCallback, useEffect, useState } from "react"

interface CloudinaryResult {
  event: string
  info: {
    secure_url?: string
  }
}

export const useCloudinaryWidget = () => {
  const [widget, setWidget] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      setWidget(
        (window as any).cloudinary.createUploadWidget(
          {
            cloudName: "cloud-x",
            uploadPreset: "user_photos"
          },
          (error: Error, result: CloudinaryResult) => {
            if (!error && result && result.event === "success") {
              console.log("Upload success:", result.info.secure_url)
            }
          }
        )
      )
    }
  }, [])

  const open = useCallback(() => {
    if (widget) {
      widget.open()
    }
  }, [widget])

  return { open }
}

export type { CloudinaryResult };
