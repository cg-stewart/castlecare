'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function ClerkRedirectHandler() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run this effect when Clerk has loaded the user data
    if (!isLoaded) return;

    // Check if the user just signed up and is on the dashboard page
    if (isSignedIn && pathname.startsWith('/drive/dashboard')) {
      // Set a flag in localStorage to indicate successful signup
      localStorage.setItem('clerk-signed-up', 'true');
      
      // Clear the hiring form data since signup is complete
      localStorage.removeItem('hiringFormData');
      localStorage.removeItem('hiringCurrentStep');
    }
  }, [isSignedIn, isLoaded, pathname]);

  // This component doesn't render anything visible
  return null;
}
