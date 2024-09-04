import React from "react";
import Image from 'next/image'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
    logo: <span className="font-extrabold flex items-center gap-2">
        <Image src="/assets/logo.png" alt="logo"  width={50} height={50} />
        <p className="text-xl">Reclaim</p>
        </span>,
      banner: {
        key: 'connect-key',
        text: (
          <div className="flex flex-col gap-1 p-2">
            <p>✨Works out of the box guarantee. If you face any issue at all, hit us up <a href="https://t.me/protocolreclaim" target='_blank' className="underline ">on Telegram</a> and we will write the integration for you.</p>
          </div>
        )
      },
    head: (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Reclaim Developer Docs" />
        <meta name="keywords" content="reclaim, reclaim protocol, zero-knowledge, zk, identity, decentralised, deco, tls"></meta>
        <meta property="og:description" content="Build apps upon user data from around the internet" />
      </>
    ),
    project: {
      link: 'https://github.com/reclaimprotocol',
    },
    chat: {
      link: 'https://t.me/protocolreclaim',
      icon: <Image src='/assets/icons/tg.png' width={30} height={30} alt='contact'/>
    },
    docsRepositoryBase: 'https://github.com/reclaimprotocol',
    footer: {
      text: 'Reclaim Protocol © 2021',
    },
  }
  
  export default config