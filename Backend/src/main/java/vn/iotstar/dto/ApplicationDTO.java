package vn.iotstar.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private LocalDate date;
    private String status;
    private String note;
    private String CV;
    private String recruitmentNewsTitle;
    private Integer recruitmentNewsId; 
}