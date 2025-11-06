package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.iotstar.entity.Employer;

@Repository
public interface IEmployerRepository extends JpaRepository<Employer, Integer> {
    Employer findByAccount_accountID(Integer accountID);
}
