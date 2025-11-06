package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.iotstar.entity.Employer;
import vn.iotstar.repository.IEmployerRepository;
import vn.iotstar.service.IEmployerService;

@Service
public class EmployerService implements IEmployerService {

    @Autowired
    private IEmployerRepository employerRepository;

    @Override
    public Employer findByAccount_accountID(Integer accountId) {
        return employerRepository.findByAccount_accountID(accountId);
    }

    @Override
    public <S extends Employer> S save(S entity) {
        return employerRepository.save(entity);
    }

    @Override
    public long count() {
        return employerRepository.count();
    }
}
