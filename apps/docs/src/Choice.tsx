import { Pressable, View } from "react-native";
import { Text } from "@bubbasfw/ui";
export function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
  compactLabel = false,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  compactLabel?: boolean;
}) {
  return (
    <View className="min-w-0 max-w-full gap-2">
      <Text
        variant="caption"
        tone="muted"
        className={compactLabel ? "hidden md:flex" : undefined}
      >
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-1">
        {options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${option}`}
            accessibilityState={{ selected: option === value }}
            aria-pressed={option === value}
            onPress={() => onChange(option)}
            className={`min-h-[44px] min-w-[44px] items-center justify-center rounded px-3 web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-ui-focus web:focus-visible:outline-offset-2 ${option === value ? "bg-bubba-blue" : "bg-ui-surface web:hover:bg-ui-hover"}`}
          >
            <Text
              variant="small"
              className={
                option === value ? "font-semibold text-black" : "text-ui-muted"
              }
            >
              {option[0].toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
