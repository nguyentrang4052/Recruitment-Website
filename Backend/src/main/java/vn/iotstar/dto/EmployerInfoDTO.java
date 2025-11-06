package vn.iotstar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerInfoDTO {
    private Integer employerID;
    private String employerName;
    private String representative;
    private String phone;
    private String companyWebsite;
    private String companyProfile;
    private String address;
    private String companyLogo;
    private String detailedAddress;
    private String registeredProvince;
    private String registeredWard;



}
