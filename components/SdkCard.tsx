import MakeIcon from "./MakeIcon"
import Image from 'next/image'
import Link from 'next/link'

type SdkCardProps = {
    title: string
    subtitle: string
    tag: string
    iconName: string
    link: string
}

const SdkCard = ({ title, subtitle, tag, iconName, link }: SdkCardProps) => {
    return (
        <Link href={link}>
        <div className='flex flex-col gap-3 cursor-pointer  border-slate-700 border-2 rounded-sm p-4'>
            <div className='flex  font-semibold gap-2'>
                <MakeIcon iconName={iconName} />
                <div className='flex flex-col'>
                    <div className='flex gap-4 items-center'>
                        <h3>{title}</h3>
                        <Image src='/assets/icons/right-arrow.svg' className='text-white' width={15} height={15} alt='right arrow icon' />
                    </div>
                    <p className='font-normal text-xs'>{subtitle}</p>
                </div>
            </div>
            <p className='text-xs font-semibold self-end bg-blue-600 bg-opacity-75 w-max p-1 rounded-sm'>{tag}</p>
        </div>
        </Link>
    )
}

export default SdkCard