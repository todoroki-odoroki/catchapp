import React, { useCallback, useEffect, useState } from 'react'

const maxFileSizeMB = 5

type FileSizeUnit = 'bytes' | 'KB' | 'MB'

// eslint-disable-next-line import/no-anonymous-default-export
export default ({src, onSend}:{src?: string, onSend?: (file: File) => void}) => {
  const [imageUrl, setImageUrl] = React.useState(src)
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>();

  const fileSizeByUnit = (size: number, unit: FileSizeUnit) => {
    switch (unit) {
      case 'bytes':
        return size
      case 'KB':
        return (size / 1024).toFixed(1)
      case 'MB':
        return (size / 1048576).toFixed(1)
      default:
        return size
    }
  }

  const checkFileType = (type: string) => {
    return /image\/(jpg|jpeg|png)$/.test(type)
  }

  const checkFileSizeMB = (fileSize: number) => {
    return maxFileSizeMB >= fileSizeByUnit(fileSize, 'MB')
  }

  const checkImage = (file: File) => {
    return checkFileSizeMB(file.size) && checkFileType(file.type)
  }

  const handleImageSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    if (!checkImage(file)) {
      alert('file is too big!')
      return
    }
    setFile(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload =  () => {
      const dataUrl = reader.result
      if (!reader.result) return
      if (!(typeof dataUrl === "string")) return
      setImageUrl(dataUrl)
    }
  }

  const handleSend= useCallback(() => {
    if(!file)return
    onSend?.(file);
    setFile(undefined);
    setImageUrl("")
  }, [file, onSend])

  const handleUploadAreaClick = () => {
    hiddenFileInputRef?.current?.click()
  }

  useEffect(() => {
    setImageUrl(src)
  }, [src])


  return {
    handleImageSet,
    imageUrl: imageUrl,
    handleUploadAreaClick,
    hiddenFileInput: hiddenFileInputRef,
    handleSend
  }
}
