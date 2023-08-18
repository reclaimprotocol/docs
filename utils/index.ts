export type Application = {
    title: string
    link: string
    description: string
    image?: string
}

export const applications: Application[] = [
    {
        title: 'Why trust you?',
        link: 'https://whytrustyou.com/',
        description: 'Verify the credentials (name, employment) of the person communicating with you online.Save yourself from scammers!'
    },
    {
        title: 'Swags for dev',
        link: 'https://dev-swags.reclaimprotocol.org/',
        description: 'Claim your swags for your contributions to open source projects.'
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