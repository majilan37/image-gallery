import { createClient } from '@supabase/supabase-js'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getStaticProps: GetStaticProps = async () => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
  )

  const { data } = await supabaseAdmin.from('images').select('*').order('id')

  return {
    props: {
      images: data,
    },
  }
}

interface ImageType {
  id: number
  created_at: string
  name: string
  href: string
  username: string
  imageSrc: string
}

const Home = ({ images }: { images: ImageType[] }) => {
  console.log(images)
  return (
    <div className="">
      <Head>
        <title>Image Gallert</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Gallery images={images} />
    </div>
  )
}

function Gallery({ images }: { images: ImageType[] }) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 ">
      <div className="grid grid-cols-1 gap-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 ">
        {images.map(({ id, href, imageSrc, name, username }) => (
          <BlurImage
            key={id}
            href={href}
            imageSrc={imageSrc}
            name={name}
            username={username}
          />
        ))}
      </div>
    </div>
  )
}

function BlurImage({
  href,
  imageSrc,
  name,
  username,
}: Omit<ImageType, 'id' | 'created_at'>) {
  const [loading, setLoading] = useState(true)
  return (
    <a href={href} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 ">
        <Image
          src={imageSrc}
          className={cn(
            'hidden transform transition-all duration-500 group-hover:opacity-75',
            loading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          layout="fill"
          objectFit="cover"
          alt=""
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900 ">
        {username.toLowerCase()}
      </p>
    </a>
  )
}

export default Home
