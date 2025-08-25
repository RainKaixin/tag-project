// 基本信息
export type BasicInfo = {
  fullName: string;
  title: string;
  school: string;
  pronouns?: string;
  majors: string[];
  minors?: string[];
  bio: string;
};

// 社交链接
export type LinkItem = {
  id: string;
  label: string;
  url: string;
  platform?: 'instagram' | 'portfolio' | 'custom';
};

// 作品/上传
export type PortfolioItem = {
  id: string;
  title: string;
  description?: string; // 添加描述字段
  image: string; // url 或 data url
  isPublic: boolean;
  tags?: string[]; // 添加标签字段用于软件信息
};

// 移除未使用的 UploadItem 类型

// 各卡片 props
export type BasicInfoCardProps = {
  data: BasicInfo;
  onChange: (field: keyof BasicInfo, value: string) => void;
  onMajorsChange: (majors: string[]) => void;
  onMinorsChange: (minors: string[]) => void;
  errors?: Partial<Record<keyof BasicInfo, string>>;
};

export type ProfilePhotoCardProps = {
  avatar?: string; // 预览地址
  onAvatarChange: (newAvatar: File | string) => void;
};

export type SkillsCardProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

export type SocialLinks = {
  instagram: string;
  portfolio: string;
  discord: string;
  otherLinks: LinkItem[];
};

export type ProfileData = {
  fullName: string;
  title: string;
  school: string;
  pronouns?: string;
  majors: string[];
  minors?: string[];
  bio: string;
  avatar?: string;
  socialLinks: SocialLinks;
  skills: string[];
};

export type SocialLinksCardProps = {
  links: SocialLinks;
  onChange: (
    platform: 'instagram' | 'portfolio' | 'discord',
    value: string
  ) => void;
  onOtherLinksChange: (otherLinks: LinkItem[]) => void;
};

export type PortfolioGridCardProps = {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
  onDelete?: (artworkId: string) => void;
  onToggleVisibility?: (artworkId: string, isPublic: boolean) => void;
};

export type UploadWorkCardProps = {
  // 简化为空对象，因为现在只是跳转按钮
};
