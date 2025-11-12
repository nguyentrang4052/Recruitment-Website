package vn.iotstar.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ActiveJobDTO {
    private Integer id;              
    private String title;            
    private String location;
    private Integer applicants;      
    private LocalDate postedDate;    
    private String status;
}