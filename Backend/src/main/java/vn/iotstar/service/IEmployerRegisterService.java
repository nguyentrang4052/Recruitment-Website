package vn.iotstar.service;

import vn.iotstar.dto.EmployerRegisterDTO;

public interface IEmployerRegisterService {
    String registerEmployer(EmployerRegisterDTO dto);
    String verifyEmail(String token);
}
