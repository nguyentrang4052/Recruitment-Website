package vn.iotstar.service;

import vn.iotstar.entity.Employer;

public interface IEmployerService {
    Employer findByAccount_accountID(Integer accountId);
    <S extends Employer> S save(S entity);
    long count();
}
