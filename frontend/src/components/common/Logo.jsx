import logo from "../../assets/celogofull.svg";

export function Logo({ className = "h-5", alt = "CivicEye" }) {
  return <img src={logo} alt={alt} className={className} />;
}
