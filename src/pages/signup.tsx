import SignUpModule from '@/components/SignUpModule';
import UsernameStep from "@/components/SignUpSteps/UsernameStep";
import SiteLayout from "@/layouts/SiteLayout";
import Head from "next/head";
import { useState } from "react";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Social - Sign Up</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SiteLayout>
        <main>
          <SignUpModule/>
        </main>
      </SiteLayout>
    </>
  )
}
