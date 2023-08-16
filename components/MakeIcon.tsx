import Image from "next/image"
import React from "react"

const MakeIcon = ({iconName}: {iconName: string}) => {
    return(
        <Image src={`/assets/icons/${iconName}.svg`} width={24} height={24} alt='nodeJs'/>
    )
}

export default MakeIcon