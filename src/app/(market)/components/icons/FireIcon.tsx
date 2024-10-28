import React from "react"

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const FireGradient: React.FC<IconProps> = ({
  size,
  width,
  height,
  className,
}) => {
  return (
    <svg width={size || width} height={size || height} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.40559 1.11552C9.34395 1.06428 9.27089 1.0286 9.19258 1.01151C9.11427 0.994409 9.03299 0.996391 8.9556 1.01728C8.87822 1.03818 8.80699 1.07737 8.74792 1.13156C8.68885 1.18575 8.64368 1.25334 8.61621 1.32865L7.24121 5.10427L5.73121 3.64115C5.6805 3.59196 5.61994 3.55408 5.55353 3.53C5.48711 3.50592 5.41635 3.49619 5.3459 3.50145C5.27545 3.5067 5.20692 3.52683 5.14481 3.5605C5.0827 3.59416 5.02844 3.64061 4.98559 3.69677C3.63184 5.47052 2.94434 7.2549 2.94434 8.9999C2.94434 10.4586 3.5238 11.8575 4.55525 12.889C5.5867 13.9204 6.98565 14.4999 8.44434 14.4999C9.90303 14.4999 11.302 13.9204 12.3334 12.889C13.3649 11.8575 13.9443 10.4586 13.9443 8.9999C13.9443 5.28427 10.77 2.2499 9.40559 1.11552Z" fill="url(#paint0_linear_2368_2395)" />
      <defs>
        <linearGradient id="paint0_linear_2368_2395" x1="2.94434" y1="7.74995" x2="13.9443" y2="7.74995" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F43F5E" />
          <stop offset="1" stop-color="#FCD34D" />
        </linearGradient>
      </defs>
    </svg>

  )
}