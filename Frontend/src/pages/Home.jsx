import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureSelection from '../components/FeatureSelection'
import TrailersSection from '../components/TrailersSection'

function Home() {
    return (
        <>
            <HeroSection/>
            <hr></hr>
            <FeatureSelection/>
            <TrailersSection/>
        </>
    )
}

export default Home
