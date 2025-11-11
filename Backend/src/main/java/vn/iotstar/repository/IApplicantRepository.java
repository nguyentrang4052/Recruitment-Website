package vn.iotstar.repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.iotstar.entity.Account;
import vn.iotstar.entity.Applicant;

@Repository
public interface IApplicantRepository extends JpaRepository<Applicant, Integer> {

    Applicant findByAccount_accountID(Integer accountId);

    Optional<Applicant> findByApplicantID(Integer applicantID);

    @Query(value = "SELECT a.* FROM applicant a " +
            "LEFT JOIN career_information ci ON a.applicantid = ci.applicantid " +
            "LEFT JOIN applicant_skill a_s ON a.applicantid = a_s.applicantid " +
            "LEFT JOIN skill s ON a_s.skillid = s.skillid " +
            "WHERE (:keyword IS NULL OR LOWER(a.applicant_name::text) LIKE LOWER('%' || :keyword || '%') OR LOWER(ci.title::text) LIKE LOWER('%' || :keyword || '%')) " +
            "AND (:location IS NULL OR ci.location = :location) " +
            "AND (:desireLevel IS NULL OR ci.desire_level = :desireLevel) " + 
            "AND s.skill_name IN :skillNameList " + 
            "GROUP BY a.applicantid " +
            "HAVING COUNT(a_s.skillid) >= :skillCount",
            nativeQuery = true)
     Page<Applicant> searchWithSkills(
         @Param("keyword") String keyword,
         @Param("location") String location,
         @Param("desireLevel") String desireLevel, 
         @Param("skillNameList") List<String> skillNameList,
         @Param("skillCount") Long skillCount,
         Pageable pageable
     );

     
     @Query(value = "SELECT a.* FROM applicant a " +
            "LEFT JOIN career_information ci ON a.applicantid = ci.applicantid " +
            "WHERE (:keyword IS NULL OR LOWER(a.applicant_name::text) LIKE LOWER('%' || :keyword || '%') OR LOWER(ci.title::text) LIKE LOWER('%' || :keyword || '%')) " +
            "AND (:location IS NULL OR ci.location = :location) " +
            "AND (:desireLevel IS NULL OR ci.desire_level = :desireLevel)", 
            nativeQuery = true)
     Page<Applicant> searchWithoutSkills(
         @Param("keyword") String keyword,
         @Param("location") String location,
         @Param("desireLevel") String desireLevel, 
         Pageable pageable
     );
     
     Applicant findByAccount_email(String email);
}
