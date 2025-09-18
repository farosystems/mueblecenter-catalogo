"use client"

import { useState, useEffect } from "react"

const fonts = [
  "font-['Palm_Royale'] italic", 
  "font-['LT_Afficher_Neue'] font-bold", 
  "font-['Palm_Royale'] font-bold", 
  "font-['LT_Afficher_Neue'] font-medium", 
  "font-['Palm_Royale'] italic",
  "font-['LT_Afficher_Neue'] font-semibold",
  "font-['Palm_Royale'] font-bold italic",
  "font-['LT_Afficher_Neue'] font-bold"
]

const colors = [
  "#316a13", // verde oscuro
  "#8fd527", // verde claro
  "#ff2f12", // rojo
  "#316a13", // verde oscuro
  "#8fd527", // verde claro
  "#ff2f12", // rojo
  "#316a13", // verde oscuro
  "#8fd527"  // verde claro
]

export default function TypewriterText() {
  const [displayText, setDisplayText] = useState("")
  const [currentFontIndex, setCurrentFontIndex] = useState(0)
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const fullText = "MueblesCenter"

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < fullText.length) {
            setDisplayText(fullText.slice(0, displayText.length + 1))
          } else {
            // Texto completo, esperar y luego empezar a borrar
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            // Texto borrado completamente, cambiar fuente y color
            setIsDeleting(false)
            setCurrentFontIndex((prev) => (prev + 1) % fonts.length)
            setCurrentColorIndex((prev) => (prev + 1) % colors.length)
          }
        }
      },
      isDeleting ? 100 : 150,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, fullText])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span 
      className={`${fonts[currentFontIndex]} text-glow transition-all duration-700 ease-in-out inline-block`}
      style={{color: colors[currentColorIndex]}}
    >
      {displayText}
      <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}>|</span>
    </span>
  )
}
