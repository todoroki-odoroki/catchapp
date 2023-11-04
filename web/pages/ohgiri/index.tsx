import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/Home.module.css'
import { db } from '../../libs/firebase'
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Spinner,
  useToast,
  Switch,
  FormLabel,
  FormControl,
} from '@chakra-ui/react'
import TextArea from '../../components/textarea'

type Ohgiri = {
  question: string
  status: string
  createdAt: Date
  answers: Answer[]
}

type Answer = {
  content: string
  score?: number
  createdBy: string
  createdAt: Date
}

const Ohgiri: NextPage = () => {
  // State Declarations
  const [ohgiriId, setOhgiriId] = useState('')
  const [ohgiri, setOhgiri] = useState<DocumentData | null>(null)
  const [content, setContent] = useState('')
  const [createdBy, setCreatedBy] = useState('川元')
  const [isLoading, setLoading] = useState(false)
  const [isPostAnswer, setIsPostAnswer] = useState(true)
  const toast = useToast()

  // Helper Functions
  const createAnswer = () => {
    return [...(ohgiri?.answers || []), { content, createdBy, createdAt: new Date(), score: 0 }]
  }

  const createQuestion = () => {
    return { question: content, createdAt: new Date(), status: 'waiting', answers: [] }
  }

  const getChangeFunc = (value: string) => {
    setContent(value)
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreatedBy(e.target.value)
  }

  const handleToggle = () => {
    setIsPostAnswer(!isPostAnswer)
  }

  const postItem = async () => {
    setLoading(true)
    try {
      const updatedOhgiri = isPostAnswer ? { ...ohgiri, answers: createAnswer() } : createQuestion()
      const docRef = isPostAnswer ? doc(db, 'ohgiri', ohgiriId) : doc(collection(db, 'ohgiri'))
      await setDoc(docRef, updatedOhgiri)
      toast({
        title: '登録しました！',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setContent('')
    } catch (err: unknown) {
      console.log(err)
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

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, 'ohgiri'),
        where('status', '==', 'waiting'),
        orderBy('createdAt'),
        limit(1),
      )
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        setOhgiriId(doc.id)
        setOhgiri(doc.data())
      })
    }
    fetchData()
  }, [])

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
        <h1 className={styles.title}>今週の大喜利！</h1>
        {isPostAnswer && <p className={styles.description}>お題：{ohgiri?.question}</p>}
        <Box m={3}>
          <Flex justifyContent='center' gap={5} alignItems='center'>
            <TextArea
              onChange={getChangeFunc}
              value={content}
              placeholder={isPostAnswer ? '面白い答えをここに' : '新しい大喜利のお題をここに'}
            />
          </Flex>
        </Box>
        <select className={styles.card} onChange={handleChangeSelect}>
          <option value='川元'>川元</option>
          <option value='馬場'>馬場</option>
          <option value='雷鳥'>雷鳥</option>
          <option value='鈴木'>鈴木</option>
        </select>
        <Button onClick={postItem}>{isPostAnswer ? '回答を登録！！' : 'お題を登録'}</Button>
        <FormControl display='flex' justifyContent='center' alignItems='center'>
          <FormLabel fontSize='sm' mt='10'>
            お題を新規追加する
          </FormLabel>
          <Switch isChecked={!isPostAnswer} onChange={handleToggle} size='sm' mt='8' />
        </FormControl>
        <Link href='/' className={styles.link}>
          近況登録はこちら
        </Link>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Ohgiri
