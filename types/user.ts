// types/user.ts (or any shared types file)
export type UserProfileData = {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    longitude: number;
    latitude: number;
    preferred_astrology: string;
    profile_image?: string; // Make this optional with ?
  };