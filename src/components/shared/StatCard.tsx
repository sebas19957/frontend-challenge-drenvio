import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  color?: string; // Puede ser un color Tailwind o un color personalizado (hex, rgb, etc.)
  className?: string;
}

// Mapeo de colores predefinidos en Tailwind
const predefinedColors: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color = "primary",
  className = "",
}) => {
  const isTailwindColor = predefinedColors[color];

  return (
    <div
      className={cn(
        "p-4 rounded-lg text-center",
        isTailwindColor ? predefinedColors[color] : "", // Usa clases de Tailwind si el color es predefinido
        className
      )}
      style={!isTailwindColor ? { backgroundColor: `${color}1A`, color } : {}}
    >
      <p
        className={cn(
          "text-sm font-medium",
          isTailwindColor ? "text-inherit" : ""
        )}
      >
        {title}
      </p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
