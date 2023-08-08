import React from "react";
import Image from 'next/image'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
    logo: <span className="font-extrabold">
        <Image src="/assets/logo.png" alt="logo"  width={20} height={20} />
        Reclaim
        </span>,
    project: {
      link: 'https://github.com/reclaimprotocol',
    },
    // chat: {
    //   link: 'https://gmail.com',
    // },
    docsRepositoryBase: 'https://github.com/reclaimprotocol',
    footer: {
      text: 'Reclaim Protocol © 2021',
    },
  }
  
  export default config