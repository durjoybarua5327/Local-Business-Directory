import { useClerk, useUser } from '@clerk/clerk-expo'
import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { Alert } from 'react-native'
import { db } from '../../Configs/FireBaseConfig'

// Simple guard component: if current user is banned (entry in 'BannedUsers'),
// sign them out and show an alert. Otherwise render children.
export default function AuthGuard({ children }) {
	const { user } = useUser()
	const { signOut } = useClerk()

	React.useEffect(() => {
		let mounted = true
		const checkBan = async () => {
			if (!user) return
			try {
				const email = user?.emailAddresses?.[0]?.emailAddress
				if (!email) return
				const ref = doc(db, 'BannedUsers', email)
				const snap = await getDoc(ref)
				if (snap.exists()) {
					const data = snap.data()
					const bannedUntil = data?.bannedUntil

					let isBanned = false
					if (bannedUntil === null) isBanned = true
					else if (bannedUntil && typeof bannedUntil === 'object') {
						let until = null
						if (typeof bannedUntil.seconds === 'number') until = new Date(bannedUntil.seconds * 1000)
						else if (typeof bannedUntil.toDate === 'function') until = bannedUntil.toDate()
						else if (bannedUntil instanceof Date) until = bannedUntil
						if (until && until > new Date()) isBanned = true
					}

					if (isBanned && mounted) {
						Alert.alert('Account banned', 'Your account has been banned. You will be signed out.')
						try { await signOut() } catch (e) { console.error('Failed signOut after ban check', e) }
					}
				}
			} catch (err) {
				console.error('AuthGuard ban check failed', err)
			}
		}

		checkBan()
		return () => { mounted = false }
	}, [user, signOut])

	return <>{children}</>
}

