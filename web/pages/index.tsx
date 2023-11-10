import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import styles from '../styles/Home.module.css'
import { db } from '../libs/firebase'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { Box, Button, Center, Flex, IconButton, Spinner, Tooltip, useToast } from '@chakra-ui/react'
import FileInput from '../components/file-input'
import { getRandomStr } from '../libs/random'
import TextArea from '../components/textarea'
import { AddIcon, CopyIcon } from '@chakra-ui/icons'
import Link from 'next/link'

const ASSET_FOLDER_NAME = 'assets'

type News = {
  content: string
  createdBy: string
  createdAt: Date
}

const Home: NextPage = () => {
  const [contents, setContents] = useState<string[]>([''])
  const [createdBy, setCreatedBy] = useState('川元')
  const [isLoading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const storage = getStorage()
  const toast = useToast()

  const addContent = useCallback(() => {
    setContents((old) => [...old, ''])
  }, [])

  const postNews = async () => {
    setLoading(true)
    try {
      const news: News[] = contents.map((c) => ({ content: c, createdBy, createdAt: new Date() }))
      const colRef = collection(db, 'colNews')
      await Promise.all([news.map(async (n: News) => await addDoc(colRef, n))])
      toast({
        title: '近況を登録しました！',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setContents([''])
    } catch (err: unknown) {
      toast({
        title: 'エラーが発生しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const getChangeFunc = (i: number) => {
    return (val: string) => {
      setContents((old) => old.map((c, index) => (index === i ? val : c)))
    }
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreatedBy(e.target.value)
  }

  const getPasteClipboardFunc = (i: number) => {
    return async () => {
      const text = await navigator.clipboard.readText()
      const changeFunc = getChangeFunc(i)
      changeFunc(text)
    }
  }

  const handleUploadFile = useCallback(
    async (file: File) => {
      const randomStr = getRandomStr()
      const fileName = randomStr + file.name
      const type = file.type
      const metaData = {
        contentType: type,
      }
      const assetsRef = ref(storage, `${ASSET_FOLDER_NAME}/${fileName}`)

      try {
        const uploadResult = await uploadBytes(assetsRef, file, metaData)
        const downloadUrl = await getDownloadURL(uploadResult.ref)
        const fileData = {
          comment: comment,
          createdBy: createdBy,
          createdAt: new Date(),
          mineType: uploadResult.metadata.contentType,
          url: downloadUrl,
        }
        const ref = doc(collection(db, 'files'))
        await setDoc(ref, fileData)
        toast({
          title: '写真アップデート成功!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setComment('')
      } catch {
        toast({ title: 'Failed to upload file', status: 'error', duration: 3000, isClosable: true })
      }
    },
    [comment, createdBy, storage, toast],
  )

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <div className={styles.container}>
      <Head>
        <title>Catch App</title>
        <meta name='description' content='Share your life update!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>近況教えて！</h1>
        <Box>
          {contents.map((c, i) => {
            return (
              <Box key={i} m={3}>
                <Flex justifyContent='center' gap={5} alignItems='center'>
                  <TextArea
                    onChange={getChangeFunc(i)}
                    value={contents[i]}
                    placeholder={'今週なにしたんだい？'}
                  />
                  <Tooltip label='クリップボードからコピー'>
                    <IconButton
                      aria-label='paste clipboard'
                      icon={<CopyIcon />}
                      onClick={getPasteClipboardFunc(i)}
                    />
                  </Tooltip>
                </Flex>
              </Box>
            )
          })}
        </Box>
        <Tooltip label='新規コンテンツ'>
          <IconButton aria-label='add textarea' icon={<AddIcon />} onClick={addContent} />
        </Tooltip>
        <select className={styles.card} onChange={handleChangeSelect}>
          <option value='川元'>川元</option>
          <option value='馬場'>馬場</option>
          <option value='雷鳥'>雷鳥</option>
          <option value='鈴木'>鈴木</option>
        </select>
        <Button onClick={postNews} m={5}>
          近況を登録！！
        </Button>
        <h1>写真は下から登録してね</h1>
        <Box m={3}>
          <FileInput onSend={handleUploadFile} />
          <TextArea onChange={setComment} value={comment} placeholder={'写真コメント'} />
        </Box>
        <Link href='/ohgiri'>
          <a>今週の大喜利はこちら</a>
        </Link>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Home
