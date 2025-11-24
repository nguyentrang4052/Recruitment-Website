package vn.iotstar.dto;

import lombok.*;
@Data
@NoArgsConstructor
public class RevenueByPackageDTO {
    private String packageName;
    private double revenue;
    private long orders;
    private double percentage;
    private String color;
    
    public RevenueByPackageDTO(String packageName, double revenue, long orders, double percentage, String color) {
        this.packageName = packageName;
        this.revenue = revenue;
        this.orders = orders;
        this.percentage = percentage;
        this.color = color;
    }
}
