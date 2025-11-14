package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewApplicantResponseDTO {
    private Integer applicantId;
    private String applicantName;
    private String position;
    private String location; 
    private String experience; 
    private List<String> skills; 
    private String appliedDate; 
    private String status; 
    private String cvLink; 
    private String avatar; 
    private Integer recruitmentNewsId; 
}