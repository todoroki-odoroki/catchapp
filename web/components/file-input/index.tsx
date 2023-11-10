import { Box, Button, Image, Input } from '@chakra-ui/react'
import React from 'react'
import useFileInput from './hooks'

export type Props = {
  className?: string
  onSend?: (file: File) => void
}

const FileInput = ({ onSend }: Props) => {
  const {
    handleImageSet,
    imageUrl: imageUrl,
    handleUploadAreaClick,
    hiddenFileInput,
    handleSend,
  } = useFileInput({ onSend })
  return (
    <Box>
      <Button onClick={handleUploadAreaClick} m={2}>
        写真添付！
      </Button>
      <Button onClick={handleSend} m={2}>
        写真送信！
      </Button>
      <Input
        type='file'
        size='md'
        onClick={handleUploadAreaClick}
        ref={hiddenFileInput}
        onChange={handleImageSet}
        accept='.png, .jpg, .jpeg, .gif, .svg'
        multiple={false}
        display='none'
      />
      {imageUrl && <Image src={imageUrl} alt='' />}
    </Box>
  )
}

export default FileInput
