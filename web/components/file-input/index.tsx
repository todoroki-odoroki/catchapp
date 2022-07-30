import { Box, Button, Image, Input } from '@chakra-ui/react'
import React from 'react'
import useFileInput from './hooks'

export type Props = {
  className?: string
  onSend?: (file: File) => void
}

const FileInput = ({  onSend }: Props) => {
  const {
    handleImageSet,
    imageUrl: imageUrl,
    handleUploadAreaClick,
    hiddenFileInput,
    handleSend
  } = useFileInput({onSend})
  return (
    <Box>
      <Button onClick={handleUploadAreaClick}>ファイル添付！</Button>
      <Input type='file' size='md' onClick={handleUploadAreaClick} ref={hiddenFileInput} onChange={handleImageSet} accept=".png, .jpg, .jpeg, .gif, .svg" multiple={false} display="none"/>
      {imageUrl && <Image src={imageUrl} alt=""/>}
      <Button onClick={handleSend}>ファイル送信！</Button>
    </Box>
  )
}

export default FileInput
