package vn.iotstar.util;

import java.math.BigDecimal;

public class FormatSalary {
	private static String removeTrailingZeros(BigDecimal value) {
	    return value.stripTrailingZeros().toPlainString();
	}

	public static String formatCurrencyShort(BigDecimal value) {
	    if (value == null) return "";

	    BigDecimal billion = new BigDecimal("1000000000");
	    BigDecimal million = new BigDecimal("1000000");
	    BigDecimal thousand = new BigDecimal("1000");

	    // >= 1 tỷ
	    if (value.compareTo(billion) >= 0) {
	        BigDecimal result = value.divide(billion);
	        return removeTrailingZeros(result) + " tỷ";
	    }

	    // >= 1 triệu
	    if (value.compareTo(million) >= 0) {
	        BigDecimal result = value.divide(million);
	        return removeTrailingZeros(result) + " triệu";
	    }

	    // >= 1 nghìn
	    if (value.compareTo(thousand) >= 0) {
	        BigDecimal result = value.divide(thousand);
	        return removeTrailingZeros(result) + " nghìn";
	    }

	    return value.toPlainString() + " VND";
	}
	

	public static String formatRangeShort(String value) {
	    if (value == null || value.isEmpty()) return "";

	    try {
	        String[] parts = value.split("-");
	        if (parts.length != 2) return "";

	        String minStr = parts[0].trim();
	        String maxStr = parts[1].trim();

	        BigDecimal min = new BigDecimal(minStr);
	        BigDecimal max = new BigDecimal(maxStr);

	        return formatCurrencyShort(min) + " - " + formatCurrencyShort(max);

	    } catch (Exception e) {
	        return "Không xác định";
	    }
	}

//    private static String removeTrailingZeros(double value) {
//        if (value == (long) value) {
//            return String.valueOf((long) value);
//        } else {
//            return String.format("%.2f", value).replaceAll("\\.?0+$", "");
//        }
//    }

}
