// Helper functions extracted from TAGMePage.js
export const getTagColor = tag => {
  const colors = {
    Illustration: 'bg-purple-200 text-purple-800',
    'Character Design': 'bg-blue-200 text-blue-800',
    'Game Design': 'bg-green-200 text-green-800',
    '3D Modeling': 'bg-purple-200 text-purple-800',
    Film: 'bg-orange-200 text-orange-800',
    Storyboard: 'bg-blue-200 text-blue-800',
    'Graphic Design': 'bg-pink-200 text-pink-800',
    Branding: 'bg-blue-200 text-blue-800',
    VFX: 'bg-purple-200 text-purple-800',
    Compositing: 'bg-orange-200 text-orange-800',
    Animation: 'bg-green-200 text-green-800',
    '2D Art': 'bg-pink-200 text-pink-800',
  };
  return colors[tag] || 'bg-gray-200 text-gray-800';
};

export const getProgressColor = tag => {
  const colors = {
    Illustration: 'bg-purple-500',
    'Character Design': 'bg-blue-500',
    'Game Design': 'bg-green-500',
    '3D Modeling': 'bg-purple-500',
    Film: 'bg-orange-500',
    Storyboard: 'bg-blue-500',
    'Graphic Design': 'bg-pink-500',
    Branding: 'bg-blue-500',
    VFX: 'bg-purple-500',
    Compositing: 'bg-orange-500',
    Animation: 'bg-green-500',
    '2D Art': 'bg-pink-500',
  };
  return colors[tag] || 'bg-gray-500';
};
