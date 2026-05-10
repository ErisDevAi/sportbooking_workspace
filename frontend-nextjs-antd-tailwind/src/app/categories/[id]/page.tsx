import CardCat from "@/components/CardCat";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const initialCategories = [
    {
      id: "1",
      name: "Học tập",
      icon: "📚",
      color: "#1677ff",
      isPublic: true,
      children: [
        {
          id: "1-1",
          name: "Toán học",
          icon: "➗",
          color: "#1677ff",
          isPublic: true,
          count: 2,
        },
        {
          id: "1-2",
          name: "Toán học 2",
          icon: "➗",
          color: "#1677ff",
          isPublic: true,
          count: 2,
        },
      ],
      count: 3,
    },
    {
      id: "2",
      name: "Giải trí",
      icon: "🎮",
      color: "#52c41a",
      isPublic: true,
      count: 0,
    },
    {
      id: "3",
      name: "Sức khỏe",
      icon: "🍎",
      color: "#f5222d",
      isPublic: false,
      count: 5,
    },
  ];
  const { id } = await params;
  const category = initialCategories.find((cat) => cat.id === id);
  return (
    <div>
      My Post {category?.name}:{" "}
      {category?.children?.map((child) => (
        <CardCat
          id={child.id}
          icon={child.icon}
          count={child.count}
          isPublic={child.isPublic}
          color={child.color}
          name={child.name}
          type="subcategory"
        />
      ))}
    </div>
  );
}
