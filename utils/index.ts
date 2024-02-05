export type Application = {
    title: string
    link: string
    description: string
    image?: string
}

export const applications: Application[] = [
    //TODO@madhavan: update links
    {
        title: 'P2PX',
        description: '100% decentralised P2P exchange using off chain proofs. Buy & Sell USDT/INR, automatic KYC.',
        link: 'https://www.p2px.finance/'
    },
    {
        title: 'Showdown',
        link: 'https://showdown.win',
        description: 'Bring your gamer ratings to a championship'
    },
    {
        title: 'NivaPay',
        link: 'https://nivapay.com',
        description: 'Get loans against pending shipments'
    },
    {
        title: 'ZKMe',
        description: 'A tool to do generate and store cryptographic proofs of your identity',
        link: 'https://zk.me'
    },
    {
        title: 'CodedEstate',
        link: 'https://codedestate.com',
        description: 'Bring your Real Estate onchain to unlock RWAs'
    },
    {
        title: 'Gitcoin Passport',
        link: 'passport.gitcoin.org',
        description: 'Prove you are a human using your online activity.'
    },
    {
        title: 'Verax',
        link: 'https://verax.linea.app',
        description: 'Generate your Onchain attestation using Verax by Consensys & Linea'
    },
    {
        title: 'Ethereum Attestation Service',
        link: 'https://attest.sh',
        description: 'Generate your Onchain attestation using EAS'
    },
]