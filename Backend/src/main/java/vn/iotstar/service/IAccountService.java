package vn.iotstar.service;

import java.util.List;
import java.util.Optional;

import vn.iotstar.entity.Account;

public interface IAccountService {

	Optional<Account> findById(Integer id);

	<S extends Account> S save(S entity);

	Account findByUsername(String username);

	List<Account> findAll();

}
