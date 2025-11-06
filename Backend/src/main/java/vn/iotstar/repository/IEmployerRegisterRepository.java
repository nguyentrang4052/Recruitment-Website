package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.iotstar.entity.Employer;
import vn.iotstar.entity.Account;

public interface IEmployerRegisterRepository extends JpaRepository<Employer, Integer> {
	Employer findByAccount(Account account);
}
