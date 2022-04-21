
import HelpIcon from "./HelpIcon"
import { MenuActiveContext } from "../../context/MenuActiveContext"
import { useState } from "react"
import HelpInstructions from "./HelpInstructions"

const HelpMenu = () => {
  const [menuActive, setMenuActive] = useState(false);

  const flipMenuActive = () => {
    console.log('pressed', menuActive); 
    setMenuActive(!menuActive);
  }

  return (
      <MenuActiveContext.Provider value ={{flipMenuActive: flipMenuActive}}>
          <HelpIcon></HelpIcon>
          {menuActive && 
          <HelpInstructions />
          }
      </MenuActiveContext.Provider>
  )
}

export default HelpMenu