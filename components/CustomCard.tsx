import React from "react"
import Link from 'next/link'

const CustomCard = ({ title, description, image, link }: {title: string, description: string, link: string, image?: string}) => {
    return (
        <Link href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <div className="flex flex-col rounded-xl shadow-xl p-8 border border-blue-400 border-opacity-60 h-[100%]">

                <h2 className="text-2xl font-bold mt-4">{title}</h2>
                <p className="text-gray-400 mt-2">{description}</p>
            </div>
        </Link>
    )
}

export default CustomCard