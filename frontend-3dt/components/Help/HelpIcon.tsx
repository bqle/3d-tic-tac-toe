
import Image from "next/image"
import { useEffect } from "react"
import questionMarkImg from '../../public/question_mark.png'
import { useCallback, useContext } from "react"
import { MenuActiveContext } from "../../context/MenuActiveContext"

const HelpIcon = () => {

    const {flipMenuActive} = useContext(MenuActiveContext)

    return (
        <div style={
            {position:'fixed',
            bottom: '10px',
            left: '10px',
            width: '50px',
            height: '50px',
            color: 'white',
            zIndex: 1,
            overflow: 'hidden',
            textAlign: 'center',
            verticalAlign: 'middle'
        }}
            onClick= {flipMenuActive}    
        >
           <Image src={questionMarkImg} alt="HELP" layout="fill" priority/> 
        </div>
    )
}

export default HelpIcon