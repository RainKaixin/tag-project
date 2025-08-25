// 设置页面类型定义

export interface BasicInfoCardProps {
  data: {
    fullName: string;
    title: string;
    school: string;
    pronouns: string;
    majors: string[];
    bio: string;
  };
  onChange: (field: string, value: string) => void;
  onMajorsChange: (majors: string[]) => void;
  errors: Record<string, string>;
}

export interface ProfilePhotoCardProps {
  avatar: string;
  onAvatarChange: (newAvatar: File) => void;
}

export interface SkillsCardProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface SocialLinksCardProps {
  links: {
    instagram: string;
    portfolio: string;
  };
  onChange: (platform: string, value: string) => void;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  isPublic: boolean;
}

export interface PortfolioGridCardProps {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
}

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadWorkCardProps {
  onUploadComplete: (newItems: UploadItem[]) => void;
}

