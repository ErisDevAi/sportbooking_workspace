import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Badge, Card, Tag } from "antd";
import Link from "next/link";

interface CardCatProps {
  id: string;
  icon: string;
  count: number;
  isPublic: boolean;
  color: string;
  name: string;
  type?: "category" | "subcategory";
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const CardCat: React.FC<CardCatProps> = ({
  id,
  icon,
  count,
  isPublic,
  color,
  name,
  type = "category",
  onEdit,
  onDelete,
}) => {
  return (
    <Link
      href={`/${type === "category" ? "categories" : "wheels"}/${id}`}
      className="block"
    >
      <Card
        hoverable
        className="relative overflow-hidden"
        style={{ borderTop: `5px solid ${color}` }}
        actions={[
          <EditOutlined key="edit" onClick={onEdit} />,
          <DeleteOutlined
            key="delete"
            onClick={onDelete}
            className="text-red-500"
          />,
        ]}
      >
        <div className="flex justify-between items-start">
          <span className="text-4xl">{icon}</span>
          <Badge count={count} color="blue" showZero />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Tag color={isPublic ? "green" : "default"}>
            {isPublic ? "Công khai" : "Riêng tư"}
          </Tag>
        </div>
      </Card>
    </Link>
  );
};

export default CardCat;
