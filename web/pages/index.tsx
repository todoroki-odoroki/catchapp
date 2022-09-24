import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import styles from '../styles/Home.module.css'
import { db } from '../libs/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { Box, Button, Center, IconButton, Spinner, useToast } from '@chakra-ui/react'
import FileInput from '../components/file-input'
import { getRandomStr } from '../libs/random'
import TextArea from '../components/textarea'
import { AddIcon } from '@chakra-ui/icons'

const ASSET_FOLDER_NAME = "assets"

type News = {
  content: string
  createdBy: string
  createdAt: Date
}

const Home: NextPage = () => {
  const [contents, setContents] = useState<string[]>([""])
  const [createdBy, setCreatedBy] = useState('川元')
  const [isLoading, setLoading] = useState(false)
  const storage = getStorage();
  const toast = useToast()

  const addContent = useCallback(() => {
    setContents(old => [...old, ''])
  }, [])


  const postNews = async () => {
    setLoading(true)
    try {
      const news: News[] = contents.map(c => ({content: c, createdBy, createdAt: new Date()}))
      const ref = doc(collection(db, 'colNews'))
      await Promise.all([news.map(async (n:News) => await setDoc(ref, n))])
      toast({
        title: "近況を登録しました！",
        status: "success",
        duration:3000,
        isClosable: true
      })
      setContents([''])
    } catch (err: unknown) {
      toast({
        title: "エラーが発生しました",
        status: 'error',
        duration:3000,
        isClosable: true
      })
    } finally {
      setLoading(false)
    }
  }

  const getChangeFunc = (i: number) => {
    return (val: string) => {
      setContents((old)=> old.map((c, index) => (index === i ? val : c)))
    }
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreatedBy(e.target.value)
  }

  const handleUploadFile = useCallback(async(file: File) => {
    const randomStr = getRandomStr();
    const fileName =  randomStr + file.name;
    const type = file.type
    const metaData = {
      contentType: type
    }
    const assetsRef = ref(storage, `${ASSET_FOLDER_NAME}/${fileName}`)

    try{
      const data = await uploadBytes(assetsRef, file, metaData);
      const fileData = {
        createdBy: createdBy,
        createdAt: data.metadata.timeCreated,
        mineType: data.metadata.contentType,
        url: data.metadata.fullPath
      }
      const ref = doc(collection(db, 'files'))
      await setDoc(ref, fileData)
      toast({title: "ファイルアップデート成功", status: "success", duration: 3000, isClosable: true})
    }catch{
      toast({title: "Failed to upload file", status: "error", duration: 3000, isClosable:true })
    }
  }, [createdBy, storage, toast])

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
        <Box >
        {
          contents.map((c, i) => {
            return (
              <Box key={i} m={3}>
                <TextArea  onChange={getChangeFunc(i)}/>
                </Box>)
          })
        }
        </Box>
        <IconButton aria-label='add textarea' icon={<AddIcon/>} onClick={addContent}/>
        <select className={styles.card} onChange={handleChangeSelect}>
          <option value='川元'>川元</option>
          <option value='馬場'>馬場</option>
          <option value='雷鳥'>雷鳥</option>
          <option value='鈴木'>鈴木</option>
        </select>
        <Button onClick={postNews}>近況を登録！！</Button>
        <FileInput onSend={handleUploadFile}/>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Home
