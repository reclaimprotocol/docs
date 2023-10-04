export type Application = {
    title: string
    link: string
    description: string
    image?: string
}

export const applications: Application[] = [
    // {
    //     title: 'Why trust you?',
    //     link: 'https://whytrustyou.com/',
    //     description: 'Verify the credentials (name, employment) of the person communicating with you online.Save yourself from scammers!'
    // },
    // {
    //     title: 'Swags for dev',
    //     link: 'https://dev-swags.reclaimprotocol.org/',
    //     description: 'Claim your swags for your contributions to open source projects.'
    // },
    {
        title: 'P2PX',
        description: '100% decentralised P2P exchange using off chain proofs. Buy & Sell USDT/INR, no KYC required. Powered by Reclaim Protocol',
        link: 'https://www.p2px.finance/'
    },
    {
        title: 'Whistleblower',
        description: 'A platform to anonymously report corruption and crime or use it for fun',
        link: 'https://t.co/wiEvuCGmIQ'
    },
    {
        title: 'EduClaim: Your digital Academic Identity',
        link: 'https://ethglobal.com/showcase/educlaim-your-digital-academic-identity-a0ki5',
        description: 'Seamlessly unlock student-centric benefits like discounts, loan validations, and exclusive access'
    },
    {
        title: 'Reclaim ZK bot',
        link: 'https://devfolio.co/projects/reclaim-zk-bot-2438',
        description: 'Simplifies online data verification, enhancing security, privacy and fostering trust within digital communities.'
    },
    {
        title: 'Verified',
        link: 'https://git-verified.vercel.app/',
        description: 'Claim your Github Contributions on Lens'
    },
    {
        title: 'Dealflex',
        link: 'https://dealflex.vercel.app/claim-deal',
        description: 'Claim your deal on Dealflex with your verified Reclaim credentials'
    },
    {
        title: 'Reclaim GSoC bounty',
        link: 'https://github.com/solvedbiscuit71/reclaim-gsoc',
        description: 'Claim your bounty for contributing to GSoC project using Reclaim credentials'
    }
]