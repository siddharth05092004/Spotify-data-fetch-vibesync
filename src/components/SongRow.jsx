import { useEffect } from "react";
import { motion } from "framer-motion"

function SongRow(props){
    
    return(<>
        <motion.div
          initial={{ opacity: 0, scale:0.80,y:50}}
          whileInView={{ opacity: 1, scale:1,y:0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }} className="min-h-16 max-h-16 poppins-regular max-w-6xl grid grid-cols-2 rounded-lg overflow-hidden bg-tertiary text-primary text-lg lg:text-2xl   ">
            
            <div className="whitespace-nowrap flex"><img src={props.value[0]} className="w-12 border-2 border-white rounded-lg" alt="" /><div className="p-4 line-clamp-1">{props.value[1]}</div></div>
            <div className="p-4 whitespace-nowrap gap-4 flex justify-between"><div>{props.value[2]}</div><div className="w-1/3">{props.value[3]}</div></div>
            
        </motion.div>
    </>)

}

export default SongRow;