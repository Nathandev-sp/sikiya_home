import Image from 'next/image'
import logoImage from '@/assets/LogoSikiya/NathanApprovedSikiyaLogo1NB.png'

export function Logo(props) {
  return (
    <Image
      src={logoImage}
      alt="Sikiya Logo"
      {...props}
      priority
    />
  )
}
