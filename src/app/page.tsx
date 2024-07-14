'use client'
import './styles.scss'

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
  const [showMouseTrail, setShowMouseTrail] = useState(false)

  const windowHeight = window.innerHeight
  addEventListener("scroll", (event) => {
    const isSCrolledDown = window.scrollY > windowHeight * 0.4
    if (isSCrolledDown && !showMouseTrail) {
      setShowMouseTrail(true)
    }
    if (!isSCrolledDown && showMouseTrail) {
      setShowMouseTrail(false)
    }
  });

  const getIsMobile = () => {
    return ((window.innerWidth <= 961));
  }

  const isMobile = getIsMobile()

  return (
    <div className='homepage__wrapper'>
      <div className='homepage__header-wrapper'>
        <div className='homepage__header-title'>{"3D EMBED"}</div>
        <button className='homepage__header-cta'>{"START CREATING"}</button>
      </div>
      <div className='homepage__hero'>
        <div className='homepage__hero-left'>
          <div className='homepage__hero-title'>
            {"Create Outstanding 3D Web Experiences"}
          </div>
          {isMobile && (
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
          >
            {"START CREATING"}
          </button>
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
      {/* <div
        className='homepage__ballpit'
      >
        <ImageParticles

        />
      </div> */}
      {showMouseTrail && <MouseTrail />}
      {/* <SignedIn>
        <p>Welcome, {user?.name}</p>
        <LogoutButton />
      </SignedIn>

      <SignedOut>
        <p>Not authenticated</p>
        <LoginButton />
      </SignedOut> */}
      {/* <MouseTrail /> */}
    </div >
  )
}