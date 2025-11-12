package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantSearchDTO {
    private String searchTerm;
    private String location;
    private String experience;
    private List<String> skills;
    
    @Min(value = 0, message = "Page phải >= 0")
    private Integer page = 0;
    
    @Min(value = 1, message = "Size phải >= 1")
    private Integer size = 12; 
}