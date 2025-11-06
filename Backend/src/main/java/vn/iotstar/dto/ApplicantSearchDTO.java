package vn.iotstar.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantSearchDTO {
    
 
    private String searchTerm; 
    private String location; 
    private String experience; 
    private List<String> skills; 


    private int page = 0; 
    private int size = 10;
	
}