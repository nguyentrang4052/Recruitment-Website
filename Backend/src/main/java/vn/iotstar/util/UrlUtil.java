package vn.iotstar.util;

public class UrlUtil {
	 public static String replaceLocalhost(String url, String baseUrl) {
	        if (url == null) return null;
	        return url.replaceAll("https?://localhost:\\d+", baseUrl);
	    }
}
