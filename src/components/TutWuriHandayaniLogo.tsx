import React from 'react';

interface TutWuriHandayaniLogoProps {
  className?: string;
  size?: number | string;
}

export const TUT_WURI_HANDAYANI_IMG_URL = 
  'https://res.cloudinary.com/bzjlphdy/image/upload/v1787204521/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.svg';

export const TutWuriHandayaniLogo: React.FC<TutWuriHandayaniLogoProps> = ({ 
  className = 'w-10 h-10',
  size 
}) => {
  return (
    <img
      src={TUT_WURI_HANDAYANI_IMG_URL}
      alt="Logo Tut Wuri Handayani - Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi"
      className={`object-contain select-none transition-transform ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
};
