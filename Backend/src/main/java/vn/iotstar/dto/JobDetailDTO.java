package vn.iotstar.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class JobDetailDTO extends ActiveJobDTO {
    private String description;
    private String experience;
    private String literacy;
    private String level;
    private Integer minSalary;  
    private Integer maxSalary;  
    private String benefit;
    private String formOfWork;    
    private String workingTime;
    private String applyBy;
    private LocalDate deadline;
    private Integer numbersOfViews;
    private Integer numbersOfRecords;
    private List<SkillDTO> skills; 
    private Integer quantity;
    private Boolean isActive;

}