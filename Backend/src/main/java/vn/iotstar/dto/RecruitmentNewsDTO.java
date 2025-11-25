package vn.iotstar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.iotstar.enums.EFormOfWork;
import vn.iotstar.enums.EStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecruitmentNewsDTO {
    private Integer id;
    private String position;
    private String description;
    private String benefit;
    private String location;
    private String formOfWork;
    private String workingTime;
    private String applyBy;
    private String literacy;
    private String experience;
    private String level;
    private Integer employerID;
    private BigDecimal maxSalary;
    private EStatus status;
    private List<String> requirements; 
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate deadline;
    private BigDecimal minSalary;
    private String requirement;
}
