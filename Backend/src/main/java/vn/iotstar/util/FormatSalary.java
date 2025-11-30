package vn.iotstar.util;

public class FormatSalary {
    public static String formatCurrencyShort(Long value) {
        if (value == null) return "";

        if (value >= 1_000_000_000L) {
            double result = value / 1_000_000_000.0;
            return removeTrailingZeros(result) + " tỷ";
        }
        if (value >= 1_000_000L) {
            double result = value / 1_000_000.0;
            return removeTrailingZeros(result) + " triệu";
        }
        if (value >= 1_000L) {
            double result = value / 1_000.0;
            return removeTrailingZeros(result) + " nghìn";
        }
        return value + " VND";
    }

    public static String formatRangeShort(Long min, Long max) {
        if (min == null || max == null) return "";
        return formatCurrencyShort(min) + " - " + formatCurrencyShort(max);
    }

    private static String removeTrailingZeros(double value) {
        if (value == (long) value) {
            return String.valueOf((long) value);
        } else {
            return String.format("%.2f", value).replaceAll("\\.?0+$", "");
        }
    }

}
