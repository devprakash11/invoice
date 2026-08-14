import logo from '../assets/logo3.png'

export default function Logo({ className = '' }) {
  return <img src={logo} alt="Limitless Design logo" className={`object-contain ${className}`} />
}
