
import { MenuActiveContext } from "../../context/MenuActiveContext" 
import { useContext } from "react"
import Image from "next/image"
import closeButton from "../../public/x_button.png"

const HelpInstructions = () => {
    const {flipMenuActive} = useContext(MenuActiveContext)

    return (
        <div style={
            {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400px',
            height: '200px',
            WebkitTransform: 'translate(-50%, -50%)',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            padding: '20px',
            zIndex: 2,
            backgroundColor: 'white',
            overflow: 'hidden',
            textAlign: 'center',
            verticalAlign: 'middle'
        }}
        >
            <Image src={closeButton} alt="Close" layout="raw" priority
                width="30px" height="30px" 
                style={
                    {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: 'pointer',
                }}
                onClick={flipMenuActive}
            /> 
            <p style={
                {
                    color: 'black',
                    fontSize: '24px',
                    margin: '0px 0px 0px 0px',
                
                }
            }>Instructions</p>
            <p style={
                {
                    overflowWrap: 'break-word',
                    fontSize: '18px',
                    lineHeight: '22px'
                }
            }
            > 
            Arrow keys - move along the x-y plane.<br />
            Q - E - move along the z axis. <br />
            First to place 3 consecutive icons in a straight line (including the body diagonal) wins!

            </p>
        </div>)
    
}

export default HelpInstructions