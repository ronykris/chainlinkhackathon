import Head from 'next/head'
import Image from 'next/image'
import 'tailwindcss/tailwind.css'
import { TwitterOauthButton } from "../components/TwitterOauthButton";



export default function Home() {
  return (
    <div>
      <p>Hello World!</p>
      <TwitterOauthButton />
    </div>
  )
}

