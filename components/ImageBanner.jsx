'use client'

import { useState, useRef, useEffect } from "react"

export default function ImageBanner() {
    const [isLoaded, setIsLoaded] = useState(false)
    const imgRef = useRef()

    function scrollToSection(sectionId) {
        const target = document.getElementById(sectionId)
        if (!target) return
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    useEffect(() => {
        if (imgRef.current.complete) {
            setIsLoaded(true)
        }
    }, [])


    return (
        <div className="banner-images">
            <img className="low-res-img" src="low_res/banner.jpeg" alt="banner-low-res" />
            <img ref={imgRef} className="high-res-img" src="med_res/banner.png" alt="banner-high-res" style={{ opacity: isLoaded ? 1 : 0 }} onLoad={() => {
                // when the high resolution image is completely loaded, this callback function will be executed and the intention is to get it to take this initially invisible image, and now make it visible
                setIsLoaded(true)
            }} />
            <div className="cta-btns-container">
                <div>
                    <div>
                        <h3>Welcome to</h3>
                        <h1>Pixelbazaar Store</h1>
                        <p className="demo-note"><strong>Portfolio demo:</strong> items shown are for demonstration only and are not for sale.</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => scrollToSection('stickers-section')}>Shop stickers</button>
                        <button type="button" onClick={() => scrollToSection('planner-section')}>Shop planner</button>
                    </div>
                </div>
            </div>
        </div>
    )
}