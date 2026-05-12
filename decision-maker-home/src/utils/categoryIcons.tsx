import {
  CoffeeOutlined,
  RocketOutlined,
  CarOutlined,
  ReadOutlined,
  ShoppingOutlined,
  SkinOutlined,
  HeartOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  BulbOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  LaptopOutlined,
  ExperimentOutlined,
  GiftOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

/**
 * Maps a category name (Vietnamese) to an Ant Design icon.
 * Uses keyword matching on the category name and slug.
 */
export function getCategoryIcon(name?: string, slug?: string): React.ReactNode {
  const text = `${name || ''} ${slug || ''}`.toLowerCase();

  if (text.includes('ăn') || text.includes('food') || text.includes('do-an') || text.includes('mon') || text.includes('nau'))
    return <CoffeeOutlined />;
  if (text.includes('hoạt động') || text.includes('làm') || text.includes('activity') || text.includes('lam-gi'))
    return <RocketOutlined />;
  if (text.includes('đi') || text.includes('place') || text.includes('địa') || text.includes('di-dau'))
    return <CarOutlined />;
  if (text.includes('học') || text.includes('study') || text.includes('sách') || text.includes('hoc'))
    return <ReadOutlined />;
  if (text.includes('mua') || text.includes('shop'))
    return <ShoppingOutlined />;
  if (text.includes('mặc') || text.includes('thời trang') || text.includes('fashion'))
    return <SkinOutlined />;
  if (text.includes('hẹn hò') || text.includes('date') || text.includes('yêu'))
    return <HeartOutlined />;
  if (text.includes('giải trí') || text.includes('chơi') || text.includes('game') || text.includes('phim'))
    return <SmileOutlined />;
  if (text.includes('thể thao') || text.includes('gym') || text.includes('sport') || text.includes('tập'))
    return <ThunderboltOutlined />;
  if (text.includes('thử thách') || text.includes('challenge'))
    return <TrophyOutlined />;
  if (text.includes('ý tưởng') || text.includes('idea') || text.includes('sáng tạo'))
    return <BulbOutlined />;
  if (text.includes('du lịch') || text.includes('travel'))
    return <EnvironmentOutlined />;
  if (text.includes('nhóm') || text.includes('team') || text.includes('bạn'))
    return <TeamOutlined />;
  if (text.includes('công nghệ') || text.includes('tech') || text.includes('code'))
    return <LaptopOutlined />;
  if (text.includes('thí nghiệm') || text.includes('experiment'))
    return <ExperimentOutlined />;
  if (text.includes('quà') || text.includes('gift'))
    return <GiftOutlined />;

  // Default
  return <AppstoreOutlined />;
}

/**
 * Returns a gradient color class based on index for category display.
 */
export function getCategoryColor(index: number): string {
  const colors = [
    'from-red-500 to-red-600',
    'from-orange-500 to-amber-600',
    'from-emerald-500 to-green-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-violet-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-teal-600',
    'from-yellow-500 to-orange-600',
  ];
  return colors[index % colors.length];
}
