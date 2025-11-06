package vn.iotstar.service;

import vn.iotstar.dto.EmployerInfoDTO;

public interface IEmployerInfoService {
    EmployerInfoDTO getEmployerInfoByUsername(String username);
    String updateEmployerInfo(EmployerInfoDTO dto);
}
