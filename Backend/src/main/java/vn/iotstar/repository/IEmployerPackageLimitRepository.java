package vn.iotstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.iotstar.entity.EmployerPackageLimit;

import java.util.Optional;

public interface IEmployerPackageLimitRepository extends JpaRepository<EmployerPackageLimit, Integer> {
    Optional<EmployerPackageLimit> findByEmployer_EmployerID(Integer employerID);

    @Modifying
    @Query("UPDATE EmployerPackageLimit e " +
           "SET e.postsLeft = e.postsLeft - 1 " +
           "WHERE e.employer.employerID = :employerID " +
           "AND e.postsLeft IS NOT NULL " +
           "AND e.postsLeft > 0")
    void decrementPostsLeft(@Param("employerID") Integer employerID);

    @Modifying
    @Query("UPDATE EmployerPackageLimit e " +
           "SET e.cvViewsLeft = e.cvViewsLeft - 1 " +
           "WHERE e.employer.employerID = :employerID " +
           "AND e.cvViewsLeft IS NOT NULL " +
           "AND e.cvViewsLeft > 0")
    void decrementCvViewsLeft(@Param("employerID") Integer employerID);
}