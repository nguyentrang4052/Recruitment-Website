package vn.iotstar.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor

public class RevenueSummaryDTO {
    private double totalRevenue;
    private double monthlyGrowth; 
    private long totalOrders;
    private double avgOrderValue; 
    
    public RevenueSummaryDTO(double totalRevenue, double monthlyGrowth, long totalOrders, double avgOrderValue) {
        this.totalRevenue = totalRevenue;
        this.monthlyGrowth = monthlyGrowth;
        this.totalOrders = totalOrders;
        this.avgOrderValue = avgOrderValue;
    }
}