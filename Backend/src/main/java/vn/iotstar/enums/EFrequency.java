package vn.iotstar.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public enum EFrequency {
	DAILY("daily", "Mỗi ngày"),
	WEEKLY("weekly", "Mỗi tuần"),
	MONTHLY("monthly", "Mỗi tháng");

	private String code;
	private String description;

	EFrequency(String code, String description) {
	        this.code = code;
	        this.description = description;
	    }

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
