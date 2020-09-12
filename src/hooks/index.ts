import { useEffect, useRef } from "react"

export const useKey = (key: string, cb: (e: KeyboardEvent) => void) => {

    
    useEffect(() => {


        const handler = (event: KeyboardEvent) => {

            
            
            if(event.key === key) {
                cb(event)
            }
        }
        document.addEventListener('keydown', handler)

        return () => {
            document.removeEventListener('keydown', handler, false)
        } 
            
    }, [key, cb])
    
}