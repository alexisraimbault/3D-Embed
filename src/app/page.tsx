"use client"
import './styles.scss'

import { useRouter } from 'next/navigation'
import {
  useAuth,
  SignedIn,
  SignedOut,
  LoginButton,
  LogoutButton,
} from '@kobbleio/next/client'
import { MouseTrail } from '../components/3dAssets/MouseTrail';
import { BallPit } from '../components/3dAssets/Ballpit';
import { ImageParticles } from '../components/3dAssets/ImageParticles';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [showBallpit, setShowBallpit] = useState(true)
  const [showMouseTrail, setShowMouseTrail] = useState(false)
  const [showImageParticles, setShowImageParticles] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const { push } = useRouter()
  const onStartCreating = () => {
    push('/editor')
  }
  let timer: null | NodeJS.Timeout = null

  if (typeof addEventListener !== "undefined") {
    addEventListener("scroll", (event) => {
      setIsScrolling(true)
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        setIsScrolling(false)
      }, 10);

      if (typeof window !== "undefined") {
        const windowHeight = window.innerHeight
        const isSCrolledDown1 = window.scrollY > windowHeight * 0.4
        const isSCrolledDown2 = window.scrollY > windowHeight * 0.8
        setScrollY(window.scrollY)

        const shouldShowBallPit = !isSCrolledDown1
        const shouldShowMouseTrail = isSCrolledDown1 && !isSCrolledDown2
        const shouldShowImageParticles = isSCrolledDown2
        if (shouldShowBallPit && !showBallpit) {
          setShowBallpit(true)
          setShowMouseTrail(false)
          setShowImageParticles(false)
        }
        if (shouldShowMouseTrail && !showMouseTrail) {
          setShowBallpit(false)
          setShowMouseTrail(true)
          setShowImageParticles(false)
        }
        if (shouldShowImageParticles && !showImageParticles) {
          setShowBallpit(false)
          setShowMouseTrail(false)
          setShowImageParticles(true)
        }
      }
    });
  }

  const getIsMobile = () => {
    if (typeof window === "undefined") {
      return false
    }
    return ((window.innerWidth <= 961));
  }

  const isMobile = getIsMobile()

  return (
    <div className='homepage__wrapper'>
      <div className='homepage__container'>
        <div className='homepage__header-wrapper'>
          <div className='homepage__header-title'>{"3D EMBED"}</div>
          <button
            className='homepage__header-cta'
            onClick={onStartCreating}
          >
            {"START CREATING"}
          </button>
        </div>
        <div className='homepage__hero'>
          <div className='homepage__hero-left'>
            <div className='homepage__hero-title'>
              {"Create Outstanding 3D Web Experiences"}
            </div>
            {isMobile && !isScrolling && (
              <div
                className='homepage__ballpit-wrapper'
              >
                <div
                  className='homepage__ballpit'
                >
                  <BallPit

                  />
                </div>
              </div>
            )}
            <div className='homepage__hero-subtitle'>
              {"Simple, Interactive, and Customizable. Captivate attention and make yourself unforgettable "}
            </div>
            <button
              className='homepage__hero-cta'
              onClick={onStartCreating}
            >
              {"START CREATING"}
            </button>
            {isMobile && (
              <div
                className='homepage__ballpit-wrapper'
              >
                <div
                  className='homepage__ballpit'
                >
                  <ImageParticles
                    isSidebar
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div
            className='homepage__ballpit-wrapper'
          >
            <div
              className='homepage__ballpit'
            >
              <BallPit
              />
            </div>
          </div>
        )}
        {!isMobile && showImageParticles && !isScrolling && (
          <div
            className='homepage__image-particles-wrapper'
            style={{
              // paddingTop: `calc(${scrollY}px + ((100vh - 40vw)/2))`,
            }}
          >
            <div
              className='homepage__image-particles'
            >
              <ImageParticles
              // isSidebar
              />
            </div>
          </div>
        )}
        {/* {showMouseTrail && <MouseTrail />} */}
        {/* <SignedIn>
        <p>Welcome, {user?.name}</p>
        <LogoutButton />
      </SignedIn>

      <SignedOut>
        <p>Not authenticated</p>
        <LoginButton />
      </SignedOut> */}
      </div >
      {showMouseTrail && !isScrolling && !isMobile && <MouseTrail />}
      {isMobile && !isScrolling && <MouseTrail />}
    </div>
  )
}