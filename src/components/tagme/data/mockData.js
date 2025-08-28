// 筛选选项数据
export const filterOptions = {
  categories: [
    { id: 'thesis-project', name: 'Thesis Project' },
    { id: 'course-project', name: 'Course Project' },
    { id: 'studio-class', name: 'Studio Class' },
    { id: 'research-collaboration', name: 'Research Collaboration' },
    { id: 'internship-project', name: 'Internship Project' },
    { id: 'startup', name: 'Startup' },
    { id: 'student-club', name: 'Student Club' },
    { id: 'interdisciplinary-teamwork', name: 'Interdisciplinary Teamwork' },
    { id: 'international-exchange', name: 'International Exchange' },
    { id: 'others', name: 'Others' },
  ],
  majors: [
    { id: 'accessory-design', name: 'Accessory Design' },
    { id: 'acting', name: 'Acting' },
    { id: 'advertising', name: 'Advertising' },
    { id: 'animation', name: 'Animation' },
    { id: 'architecture', name: 'Architecture' },
    { id: 'art-history', name: 'Art History' },
    {
      id: 'creative-business-leadership',
      name: 'Creative Business Leadership',
    },
    { id: 'fashion-design', name: 'Fashion Design' },
    { id: 'fibers', name: 'Fibers' },
    { id: 'film', name: 'Film' },
    { id: 'film-television', name: 'Film/Television' },
    { id: 'fine-art', name: 'Fine Art' },
    { id: 'game-design', name: 'Game/ITGM' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'industrial-design', name: 'Industrial Design' },
    { id: 'illustration', name: 'Illustration' },
    { id: 'interior-design', name: 'Interior Design' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'motion-design', name: 'Motion Design' },
    { id: 'painting', name: 'Painting' },
    { id: 'photography', name: 'Photography' },
    { id: 'service-design', name: 'Service Design' },
    { id: 'sequential-art', name: 'Sequential Art' },
    { id: 'ui-ux', name: 'UI/UX' },
    { id: 'visual-effects', name: 'Visual Effects' },
  ],
  tags: [
    { id: 'typography', name: 'Typography' },
    { id: 'branding', name: 'Branding' },
    { id: 'editorial', name: 'Editorial' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'experimental', name: 'Experimental' },
    { id: 'sustainable', name: 'Sustainable' },
    { id: 'interactive', name: 'Interactive' },
    { id: 'motion', name: 'Motion' },
  ],
};

// 项目数据 - 保留结构，移除图片URL
export const projects = [
  {
    id: 1,
    title: 'Typography Exploration',
    subtitle: 'Experimental type design for modern branding',
    image: null, // 移除默认图片
    categories: ['Typography', 'Minimalist'],
    author: {
      name: 'Sarah Chen',
      avatar: null, // 移除默认头像
    },
    likes: '1.2k',
    views: '8.4k',
    isLiked: false,
  },
  {
    id: 2,
    title: 'Sustainable Packaging Design',
    subtitle: 'Eco-friendly packaging solutions for retail brands',
    image: null, // 移除默认图片
    categories: ['Branding', 'Sustainable'],
    author: {
      name: 'Alex Rodriguez',
      avatar: null, // 移除默认头像
    },
    likes: '856',
    views: '5.2k',
    isLiked: true,
  },
  {
    id: 3,
    title: 'Interactive Web Experience',
    subtitle: 'Immersive digital storytelling platform',
    image: null, // 移除默认图片
    categories: ['UI/UX Design', 'Interactive'],
    author: {
      name: 'Maya Kim',
      avatar: null, // 移除默认头像
    },
    likes: '2.1k',
    views: '12k',
    isLiked: false,
  },
  {
    id: 4,
    title: '3D Character Animation',
    subtitle: 'Character design and rigging for short film',
    image: null, // 移除默认图片
    categories: ['3D Design', 'Animation'],
    author: {
      name: 'David Lee',
      avatar: null, // 移除默认头像
    },
    likes: '1.8k',
    views: '9.1k',
    isLiked: false,
  },
  {
    id: 5,
    title: 'Editorial Photography Series',
    subtitle: 'Documentary-style photography for magazine',
    image: null, // 移除默认图片
    categories: ['Photography', 'Editorial'],
    author: {
      name: 'Emma Wilson',
      avatar: null, // 移除默认头像
    },
    likes: '945',
    views: '6.7k',
    isLiked: true,
  },
  {
    id: 6,
    title: 'Motion Graphics Identity',
    subtitle: 'Dynamic brand identity with animated elements',
    image: null, // 移除默认图片
    categories: ['Motion', 'Branding'],
    author: {
      name: 'Jordan Park',
      avatar: null, // 移除默认头像
    },
    likes: '1.5k',
    views: '7.3k',
    isLiked: false,
  },
];

// 里程碑数据 - 保留结构，移除图片URL
export const milestones = [
  {
    id: 1,
    title: 'Fantasy Character Series',
    description: 'Digital illustration project exploring mythical creatures',
    image: null, // 移除默认图片
    progress: 75,
    tags: ['Illustration', 'Character Design'],
    teamMembers: [
      {
        name: 'Sarah Chen',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Alex Kim',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '3 hours ago',
  },
  {
    id: 2,
    title: 'Cyberpunk Game Environment',
    description: '3D environment design for indie game project',
    image: null, // 移除默认图片
    progress: 60,
    tags: ['Game Design', '3D Modeling'],
    teamMembers: [
      {
        name: 'Maya Rodriguez',
        avatar: null, // 移除默认头像
      },
      {
        name: 'David Lee',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Emma Wilson',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    title: 'Short Film Storyboard',
    description: 'Pre-production planning for student film festival',
    image: null, // 移除默认图片
    progress: 25,
    tags: ['Film', 'Storyboard'],
    teamMembers: [
      {
        name: 'Jordan Park',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Sophie Davis',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '1 day ago',
  },
  {
    id: 4,
    title: 'Music Festival Branding',
    description: 'Complete visual identity for campus music festival',
    image: null, // 移除默认图片
    progress: 80,
    tags: ['Graphic Design', 'Branding'],
    teamMembers: [
      {
        name: 'Mike Johnson',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Lisa Chen',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Tom Wilson',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '6 hours ago',
  },
  {
    id: 5,
    title: 'Magic VFX Sequence',
    description: 'Visual effects compositing for fantasy short film',
    image: null, // 移除默认图片
    progress: 40,
    tags: ['VFX', 'Compositing'],
    teamMembers: [
      {
        name: 'Anna Smith',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Chris Brown',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '2 days ago',
  },
  {
    id: 6,
    title: '2D Character Animation',
    description: 'Walk cycle and expressions for animated short',
    image: null, // 移除默认图片
    progress: 90,
    tags: ['Animation', '2D Art'],
    teamMembers: [
      {
        name: 'Rachel Green',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Kevin Lee',
        avatar: null, // 移除默认头像
      },
      {
        name: 'Maria Garcia',
        avatar: null, // 移除默认头像
      },
      {
        name: 'James Miller',
        avatar: null, // 移除默认头像
      },
    ],
    timestamp: '4 hours ago',
  },
];

// 职位数据 - 保留结构，移除图片URL
export const jobs = [
  {
    id: 1,
    title: 'Indie Horror Game',
    description:
      'Seeking talented artists for an atmospheric horror game project with unique visual style and immersive storytelling.',
    status: 'Open',
    timePosted: '2 days ago',
    skills: ['3D Artist', 'Concept Artist'],
    tools: ['Unity', 'Blender'],
    recruiter: {
      name: 'Alex Chen',
      avatar: null, // 移除默认头像
    },
    applicants: 5,
    dueDate: 'March 15',
  },
  {
    id: 2,
    title: 'Animated Short Film',
    description:
      'Collaborative animation project for film festival submission. Looking for creative animators and sound designers.',
    status: 'Open',
    timePosted: '1 week ago',
    skills: ['Animator', 'Sound Designer'],
    tools: ['After Effects', 'Premiere'],
    recruiter: {
      name: 'Sarah Kim',
      avatar: null, // 移除默认头像
    },
    applicants: 12,
    dueDate: 'April 2',
  },
  {
    id: 3,
    title: 'Mobile App UI Design',
    description:
      'Design intuitive and modern user interface for a productivity app targeting young professionals.',
    status: 'Urgent',
    timePosted: '3 hours ago',
    skills: ['UI Designer', 'UX Designer'],
    tools: ['Figma', 'Sketch'],
    recruiter: {
      name: 'Mike Rodriguez',
      avatar: null, // 移除默认头像
    },
    applicants: 8,
    dueDate: 'Feb 28',
  },
  {
    id: 4,
    title: 'VR Experience Project',
    description:
      'Immersive virtual reality experience for educational purposes. Seeking developers with VR development experience.',
    status: 'Open',
    timePosted: '5 days ago',
    skills: ['Unity Developer', '3D Artist'],
    tools: ['Unity', 'Oculus SDK'],
    recruiter: {
      name: 'Emma Johnson',
      avatar: null, // 移除默认头像
    },
    applicants: 3,
    dueDate: 'May 10',
  },
  {
    id: 5,
    title: 'Podcast Series Design',
    description:
      'Create visual identity and promotional materials for a student-run podcast series about design and creativity.',
    status: 'Open',
    timePosted: '1 day ago',
    skills: ['Graphic Designer', 'Motion Designer'],
    tools: ['Photoshop', 'After Effects'],
    recruiter: {
      name: 'David Lee',
      avatar: null, // 移除默认头像
    },
    applicants: 6,
    dueDate: 'March 20',
  },
];

// 合作项目数据 - 保留结构，移除图片URL
export const collaborations = [
  {
    id: 1,
    title: 'Brand Identity with Studio X',
    description:
      'Complete brand identity system for a tech startup. Seeking talented designers to join the creative team.',
    image: null, // 移除默认图片
    categories: ['Branding', 'Graphic Design'],
    author: {
      name: 'Alice Chen',
      avatar: null, // 移除默认头像
    },
    likes: '1.8k',
    views: '9.2k',
    isLiked: false,
    isBookmarked: false,
    isInitiator: true,
    role: 'Project Owner • Initiator',
    dateRange: 'January 2023 - March 2023',
    status: 'Open for Collaboration',
    skills: ['Brand Strategy', 'Logo Design', 'Visual Identity'],
    teamSize: 3,
    currentMembers: 1,
  },
  {
    id: 2,
    title: 'Interactive Web Experience',
    description:
      'Immersive digital storytelling platform with cutting-edge web technologies.',
    image: null, // 移除默认图片
    categories: ['UI/UX Design', 'Interactive'],
    author: {
      name: 'Maya Kim',
      avatar: null, // 移除默认头像
    },
    likes: '2.1k',
    views: '12k',
    isLiked: false,
    isBookmarked: false,
    isInitiator: true,
    role: 'Initiator',
    dateRange: 'February 2023 - Present',
    status: 'Open for Collaboration',
    skills: ['Frontend Development', 'UI/UX Design', 'Storytelling'],
    teamSize: 4,
    currentMembers: 2,
  },
  {
    id: 3,
    title: '3D Character Animation',
    description:
      'Character design and rigging for short film project. Looking for skilled animators.',
    image: null, // 移除默认图片
    categories: ['3D Design', 'Animation'],
    author: {
      name: 'David Lee',
      avatar: null, // 移除默认头像
    },
    likes: '1.8k',
    views: '9.1k',
    isLiked: false,
    isBookmarked: false,
    isInitiator: false,
    role: 'Character Designer',
    dateRange: 'March 2023 - June 2023',
    status: 'Open for Collaboration',
    skills: ['Character Design', '3D Modeling', 'Rigging'],
    teamSize: 5,
    currentMembers: 3,
  },
];

// 用户数据 - 保留结构，移除图片URL
export const users = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: null, // 移除默认头像
    role: 'UI/UX Designer',
    school: 'Parsons School of Design',
    skills: ['UI Design', 'UX Research', 'Prototyping'],
  },
  {
    id: 2,
    name: 'Alex Rodriguez',
    avatar: null, // 移除默认头像
    role: '3D Artist',
    school: 'California Institute of the Arts',
    skills: ['3D Modeling', 'Texturing', 'Animation'],
  },
  {
    id: 3,
    name: 'Maya Kim',
    avatar: null, // 移除默认头像
    role: 'Motion Designer',
    school: 'Rhode Island School of Design',
    skills: ['Motion Graphics', 'Video Editing', 'Storyboarding'],
  },
  {
    id: 4,
    name: 'David Lee',
    avatar: null, // 移除默认头像
    role: 'Concept Artist',
    school: 'ArtCenter College of Design',
    skills: ['Concept Art', 'Character Design', 'Environment Design'],
  },
  {
    id: 5,
    name: 'Emma Wilson',
    avatar: null, // 移除默认头像
    role: 'Photographer',
    school: 'School of Visual Arts',
    skills: ['Portrait Photography', 'Photo Editing', 'Lighting'],
  },
  {
    id: 6,
    name: 'Jordan Park',
    avatar: null, // 移除默认头像
    role: 'Graphic Designer',
    school: 'Pratt Institute',
    skills: ['Branding', 'Typography', 'Print Design'],
  },
];
