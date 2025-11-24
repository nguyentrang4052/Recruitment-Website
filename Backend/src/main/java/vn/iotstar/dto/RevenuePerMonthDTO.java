package vn.iotstar.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RevenuePerMonthDTO {
    private String month;
    private double revenue;   
    private long orders;      

    public RevenuePerMonthDTO(String month, double revenue, long orders) {
        this.month = month;
        this.revenue = revenue;
        this.orders = orders;
    }
}
