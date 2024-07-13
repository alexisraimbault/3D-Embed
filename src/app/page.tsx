'use client'

import {
  useAuth,
  SignedIn,
  SignedOut,
  LoginButton,
  LogoutButton,
} from '@kobbleio/next/client'
import { MouseTrail } from '../components/3dAssets/MouseTrail';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '16rem'
      }}>
        <div>👋</div>
        <div>0621100951</div>
      </div> */}
      <SignedIn>
        <p>Welcome, {user?.name}</p>
        <LogoutButton />
      </SignedIn>

      <SignedOut>
        <p>Not authenticated</p>
        <LoginButton />
      </SignedOut>
      <MouseTrail />
    </div>
  )
}